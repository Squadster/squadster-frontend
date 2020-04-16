import React from 'react'
import { Paper, Avatar, Typography, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import SquadMemberCardStyles from '../../assets/jss/styles/squad_page/SquadMemberCard.styles' 
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import RoleChip from './RoleChip'

const useStyles = makeStyles(SquadMemberCardStyles)

function deleleMemberMessage(user) {
  return `Вы уверены что хотите исключить пользователя ${user.firstName} ${user.lastName}`
}

export default function SquadMemberCard(props) {
  const member = props.member
  const user = member.user
  const userName = user.firstName + ' ' + user.lastName
  const classes = useStyles()
  const manage = props.manage && props.currentUser.id != member.user.id 

  return <Paper className="position-relative" square variant='outlined'>
  <div className={"my-4 mx-auto py-2 w-75"}>
    <div className='d-flex flex-row justify-content-center justify-content-md-between'>
      <div className='d-flex flex-md-row flex-column align-items-center'>
        <Avatar alt={userName} src={user.imageUrl} className={classes.avatar} />
        <RoleChip classes='mt-3 mb-2 d-flex d-md-none'
                  manage={manage}
                  openModal={props.openModal}
                  member={member} />
        <div className='d-flex flex-column ml-md-5 ml-0 my-auto text-center text-md-left'>
          <Typography variant='subtitle1'>
            {userName}
          </Typography>
          <Typography className='mt-2' variant='subtitle1'>
            {user.mobilePhone}
          </Typography>
        </div>
      </div>
      <RoleChip classes='d-none d-md-flex'
                manage={manage}
                openModal={props.openModal}
                member={member} />
      { manage ? 
        <IconButton className={classes.removeFromSquadButton} onClick={() => props.openModal(member, deleleMemberMessage(user), 'deleteMember')}>
          <PersonAddDisabledIcon className={classes.removeFromSquadIcon} />
        </IconButton>
        :
        ""
      }
    </div>
  </div>
</Paper>
}