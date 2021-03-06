import React from 'react'
import CommanderSquadConfig from './components/CommanderSquadConfig/CommanderSquadConfig'
import MemberSquadConfig from './components/MemberSquadConfig'
import SendRequestIcon from './components/SendRequestIcon'
import { TableCell, TableRow } from '@material-ui/core'
import { COMMANDER_ROLES } from 'static'

const commanderName = (squad) => {
  let commander = squad.members.find((m) => m.role === 'commander');
  return commander ? `${commander.user.lastName} ${commander.user.firstName}` : '';
}

export default function SquadRecord({user, squad}) {
  const isUsersSquad = user.squad && user.squad.id === squad.id
  const isUserCommander = user.squadMember && COMMANDER_ROLES.includes(user.squadMember.role)

  return <TableRow>
    <TableCell>{squad.squadNumber}</TableCell>
    <TableCell>{commanderName(squad)}</TableCell>
    <TableCell>
    {
      !user.squad &&
        <SendRequestIcon squad={squad} user={user} />
    }
    {
      isUsersSquad && (
        isUserCommander ? <CommanderSquadConfig user={user} squad={squad} /> : <MemberSquadConfig squad={squad}/>
      )
    }
    </TableCell>
  </TableRow>
}
