import React from 'react'
import { Avatar, List, ListItem, ListItemAvatar, Divider, IconButton, ListItemText, ButtonGroup, DialogTitle, Dialog, DialogContent, Button } from '@material-ui/core'
import { useMutation } from '@apollo/react-hooks'
import { DELETE_SQUAD_REQUEST, APPROVE_SQUAD_REQUEST } from '../../requests'
import { deleteSquadRequest, approveSquadRequest } from '../../actions'
import { useDispatch } from 'react-redux'
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import RequestModalStyles from '../../assets/jss/styles/squad_page/RequestsModal.styles'

const useStyles = makeStyles(RequestModalStyles)

export default function RequestModal({open, setOpen, user}) {
  const requests = user.squad.requests
  const dispatch = useDispatch()
  const classes = useStyles()

  const [deleteSquadRequestQuery] = useMutation(DELETE_SQUAD_REQUEST)
  const [approveSquadRequestQuery, { data }] = useMutation(APPROVE_SQUAD_REQUEST, {onCompleted: (data) => { 
    const request = data.approveSquadRequest
    dispatch(approveSquadRequest(request.squad.members, request.user))}
  })

  const cancelRequest = (request) => {
    deleteSquadRequestQuery({ variables: { id: request.id } })
    dispatch(deleteSquadRequest(request))
  }

  const approveRequest = (request) => {
    approveSquadRequestQuery({variables: { id: request.id }})
    dispatch(deleteSquadRequest(request))
  }


  return <Dialog onClose={() => setOpen(false)}
                 scroll='paper'
                 maxWidth='md'
                 open={open}>
    <DialogTitle className={classes.title}>
      <div className='my-auto'> Запросы </div>
      <IconButton className='ml-auto' onClick={() => setOpen(false)}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>  
    <DialogContent>
      <List>
        { requests.length ? requests.map(({user, id}, index) => (
          <div key={id} className='d-flex flex-column'>
            <ListItem className='d-flex flex-column flex-md-row'>
              <div className='d-flex flex-row'>
                <ListItemAvatar className={classes.avatarContainer}>
                  <Avatar className={classes.avatar} src={user.smallImageUrl} />
                </ListItemAvatar>
                <ListItemText
                  className={classes.listItemText}
                  primary={user.firstName + ' ' + user.lastName}
                  secondary={user.faculty}
                />
              </div>
              <ButtonGroup className={'ml-auto mt-2 mt-sm-0'}>
                <Button onClick={() => approveRequest({id: id})} variant="contained" color="primary">
                  Принять
                </Button>
                <Button onClick={() => cancelRequest({user: user, id: id})} className={'ml-1'} variant="contained" color="secondary">
                  Отклонить
                </Button>    
              </ButtonGroup> 
            </ListItem>
            { index !== requests.length - 1 ? <Divider className='my-3' /> : '' }
          </div>
        )) : <ListItem>
          <ListItemText primary="Нет новых запросов"/>
        </ListItem>}
      </List>
    </DialogContent>
  </Dialog>
}