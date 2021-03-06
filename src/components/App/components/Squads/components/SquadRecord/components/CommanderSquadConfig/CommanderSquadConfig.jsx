import React, { useState, useContext } from 'react'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/Settings'
import './CommanderSquadConfig.scss'
import { UPDATE_LINK_OPTION, DELETE_SQUAD, DELETE_SQUAD_MEMBER } from 'requests'
import { useMutation } from 'react-apollo'
import { useDispatch } from 'react-redux'
import { deleteSquad, updateSquad } from 'actions/squads_actions'
import ConfirmationModal from 'components/App/components/shared/ConfirmationModal'
import { AlertContext } from 'contexts'

const DELETE_SQUAD_CONFIRM_MESSAGE = "Вы уверены что хотите удалить взвод? Все студенты автоматически покинут его. \n Вы можете передать командование другому студенту и покинуть взвод"

export default function CommanderSquadConfig({squad, user}) {
  const userRole = user.squadMember.role
  const [anchorEl, setAnchorEl] = useState(null);
  const linkOption = squad.linkInvitationsEnabled
  const [open, setOpen] = useState(false)
  const showAlert = useContext(AlertContext)

  const [deleteSquadQuery] = useMutation(DELETE_SQUAD)
  const [updateLinkOptionQuery] = useMutation(UPDATE_LINK_OPTION)
  const [deleteSquadMemberQuery] = useMutation(DELETE_SQUAD_MEMBER)

  const dispatch = useDispatch()

  const handleClose = () => {
    setAnchorEl(null)
  };

  const handleConfirmSquadDeletion = (confirmed) => {
    setOpen(false)

    if (confirmed) {
      deleteSquadQuery({ variables: { id: squad.id} })
      showAlert({message: 'Ваш взвод был распущен!'})
      dispatch(deleteSquad(squad))
      handleClose()
    }
  }

  const leaveSquad = (confirmed) => {
    setOpen(false)

    if (confirmed) {
      deleteSquadMemberQuery({ variables: { id: user.squadMember.id } })

      handleClose()
      dispatch(deleteSquad())
      showAlert({message: "Вы вышли из взвода"})
    }
  }


  const patchSquad = () => {
    updateLinkOptionQuery({ variables: { id: squad.id, linkOption: !linkOption } })
    handleClose()
    showAlert({message: 'Настройки сохранены'})
    dispatch(updateSquad(squad, { linkInvitationsEnabled: !linkOption }))
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      {  userRole === 'commander' ?
        <ConfirmationModal open={open} options={{handleClose: handleConfirmSquadDeletion, message: DELETE_SQUAD_CONFIRM_MESSAGE}}/>
        : <ConfirmationModal open={open} options={{handleClose: leaveSquad, message: "Вы уверены что хотите покинуть взвод?"}}/>
      }
      <SettingsIcon style={{cursor: 'pointer'}} aria-controls="commander-squad-config" aria-haspopup="true" onClick={handleClick} />
      <Menu
        id="commander-squad-config"
        anchorEl={anchorEl}
        keepMounted
        className='commander-squad-menu'
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={patchSquad}>{linkOption ? 'Выключить' : 'Включить'} доступ по ссылке</MenuItem>
        {
          userRole === 'commander' ?
          <MenuItem className='commander-squad-menu__danger-item' onClick={() => setOpen(true)}>Расформировать взвод</MenuItem>
          : <MenuItem onClick={() => setOpen(true)}>Покинуть взвод</MenuItem>
        }
      </Menu>
    </div>
  );
}
