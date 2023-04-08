

export function getBadgeContent(status: string) {
  switch(status) {
    case 'ONAPPROVAL' :return 'Waiting Approval'
    case 'COMPLETED' :return 'Completed'
    case 'ONGOING' :return 'Ongoing'
    case 'REJECTED' :return 'Rejected'
    case 'NEEDADJUST' :return 'Need Adjust'
  }
}

export function getBadgeColor(status: string) {
  switch(status) {
    case 'ONAPPROVAL' :return 'nexus'
    case 'COMPLETED' :return 'green'
    case 'ONGOING' :return 'blue'
    case 'REJECTED' :return 'red'
    case 'NEEDADJUST' :return 'indigo'
  }
}