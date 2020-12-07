import React, { useState, useRef } from 'react'
import { Paper, Avatar, Typography, Container, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ProfileStyles from './Profile.styles'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import NotFound from 'components/App/components/shared/NotFound'
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import HelpIcon from '@material-ui/icons/Help';
import Popover from '@material-ui/core/Popover';
import { updateUserNotifications } from 'actions/current_user_actions';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/react-hooks';
import { UPDATE_NOTIFICATIONS } from 'requests';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { CopyToClipboard } from 'react-copy-to-clipboard'

const useStyles = makeStyles(ProfileStyles)

function findColleague(currentUser, user_id) {
  if (currentUser.squad) {
    const member = currentUser.squad.members.find((member) => member.user.id === user_id)
    if (member) {
      return member.user
    }
  }
}

export default function Profile() {
  const classes = useStyles();
  const currentUser = useSelector(state => state.currentUser)
  const userId = useParams().id
  const user = userId ? findColleague(currentUser, userId) : currentUser
  const [notifications, setNotifications] = useState({
    vk: currentUser.settings.vkNotificationsEnabled,
    telegram: currentUser.settings.telegramNotificationsEnabled,
    email: currentUser.settings.emailNotificationsEnabled
  });
  const dispatch = useDispatch();
  const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS);
  const handleChangeNotifications = (event) => {
    setNotifications({ ...notifications, [event.target.name]: event.target.checked });

    switch (event.target.name) {
      case "telegram":
        updateNotifications({ variables: { tg: event.target.checked }});
        break;
      case "vk":
        updateNotifications({ variables: { vk: event.target.checked }});
        break;
      case "email":
        updateNotifications({ variables: { email: event.target.checked }});
        break;
    }

    dispatch(updateUserNotifications(notifications));
  };

  const [openVkPopup, setOpenVkPopup] = useState(false);
  const [openTelegramPopup, setOpenTelegramPopup] = useState(false);
  const [openEmailPopup, setOpenEmailPopup] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const textAreaRef = useRef(null);
  const handleClickOpenVkPopup = () => {
    setOpenVkPopup(true);
  };

  const handleCloseVkPopup = () => {
    setOpenVkPopup(false);
  };

  const handleClickOpenTeleramPopup = () => {
    setOpenTelegramPopup(true);
  };

  const handleCloseTelegramPopup = () => {
    setOpenTelegramPopup(false);
  };

  const handleOpenEmailPopup = () => {
    setOpenEmailPopup(true);
  };

  const handleCloseEmailPopup = () => {
    setOpenEmailPopup(false);
  };

  const openVkGroup = () => {
    window.open('https://vk.com/club183369373','_blank');
  };

  const handleOpenPopover = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const openTGBot = () => {
    window.open('https://t.me/squadsterbot','_blank');
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  if (!user)
    return <NotFound />

  return (
    <Container>
      <Paper className={classes.root} variant='outlined'>
        <div className='d-flex flex-column flex-sm-row'>
          <Avatar
            alt={user.id}
            src={user.imageUrl}
            className={classes.avatar}
          />
          <div className='d-flex flex-column ml-sm-4 mt-4 mt-sm-0'>
            <Typography className={classes.profileTitle} variant='h4' component='h1'>
              {`${user.firstName} ${user.lastName}`}
            </Typography>
            <Typography className={classes.profileText} variant='h6' component='h2'>
              {user.birthDate}
              <br/>
              {user.mobilePhone}
              <br/>
              {user.university ? `${user.university} ${user.faculty}` : ``}
            </Typography>
          </div>
        </div>
      </Paper>
      <Paper className={classes.root} variant='outlined'>
        <div className='d-flex flex-column flex-sm-row'>
          <div className='d-flex flex-column ml-sm-4 mt-4 mt-sm-0'>
            <Typography className={classes.profileTitle} variant='h4' component='h1'>
              Уведомления
            </Typography>
            <div className='d-flex flex-row align-items-baseline'>
              <FormControlLabel control={<Switch checked={notifications.telegram} onChange={handleChangeNotifications} name="telegram" />} label="Telegram бот"/>
              <HelpIcon fontSize='small' style={{cursor:'pointer'}} onClick={handleClickOpenTeleramPopup}/>
              <Dialog open={openTelegramPopup} onClose={handleCloseTelegramPopup} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Telegram бот</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Чтобы бот имел возможность отправлять вам уведомления отправьте ему свой ключ:
                  </DialogContentText>
                  <div className='d-flex align-items-center'>
                    <TextField
                      id="outlined-read-only-input"
                      label="Ключ"
                      defaultValue={currentUser.hashId}
                      ref={textAreaRef}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                    />
                    <CopyToClipboard text={currentUser.hashId}>
                      <FileCopyIcon style={{cursor:'pointer'}} />
                    </CopyToClipboard>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseTelegramPopup} color="primary">
                    Ок
                  </Button>
                  <Button onClick={openTGBot} color="primary">
                    Перейти к боту
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className='d-flex flex-row align-items-baseline'>
              <FormControlLabel control={<Switch checked={notifications.vk} onChange={handleChangeNotifications} name="vk" />} label="VK бот"/>
              <HelpIcon fontSize='small' onClick={handleClickOpenVkPopup} style={{cursor:'pointer'}}/>
              <Dialog
                open={openVkPopup}
                onClose={handleCloseVkPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"ВК бот"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Чтобы бот мог отправлять вам уведомления напишите ему.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseVkPopup} color="primary">
                    Ок
                  </Button>
                  <Button onClick={openVkGroup} color="primary" autoFocus>
                    Перейти к боту
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div className='d-flex flex-row align-items-baseline'>
              <FormControlLabel control={<Switch checked={notifications.email} onChange={handleChangeNotifications} name="email" />} label="Электронная почта"/>
              <HelpIcon aria-describedby={id} onClick={handleOpenEmailPopup} fontSize='small' style={{cursor:'pointer'}}/>
              <Dialog
                open={openEmailPopup}
                onClose={handleCloseEmailPopup}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{"Уведомления по электронной почте"}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                  Чтобы получать уведомления по почте, убедитесь, что вы указали и подтвердили свою почту.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseEmailPopup} color="primary">
                    Ок
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </div>
      </Paper>
      <Link className='d-flex justify-content-center' to='/'>
        <Button variant='contained' color='primary' className='mt-4 color-white'>
          Назад
        </Button>
      </Link>
    </Container>
  );
}
