// @flow
import * as Consts from './consts';
import { fade } from 'material-ui/styles/colorManipulator';
import { red, blue } from 'material-ui/colors';

export const DrawerStyles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
  appFrame: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: Consts.DRAWER_WIDTH,
    width: `calc(100% - ${Consts.DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    height: 'auto',
    width: Consts.DRAWER_WIDTH,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    height: 56,
    [theme.breakpoints.up('sm')]: {
      height: 64,
    },
  },
  content: {
    width: '100%',
    marginLeft: -Consts.DRAWER_WIDTH,
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: 'calc(100% - 56px)',
    marginTop: 56,
    [theme.breakpoints.up('sm')]: {
      content: {
        height: 'calc(100% - 64px)',
        marginTop: 64,
      },
    },
  },
  contentShift: {
    marginLeft: 0,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  flex: {
    flex: 1
  },
  loginPushRight: {
    paddingRight: 24,
  },
  wrapErrorText: {
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
    maxWidth: '190px',
  },
});

export const SearchStyles = theme => ({
  wrapper: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    borderRadius: 2,
    background: theme.palette.common.white,
    '&:hover, &:focus-within': {
      background: fade(theme.palette.common.black, 0.10),
    },
  },
  search: {
    width: theme.spacing.unit * 3,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.unit,
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit * 5}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '75%',
    '&:focus': {
      outline: 0,
    },
  },
});

export const MainStyles = theme => ({
  blueTeam: {
    backgroundColor: blue[400],
  },
  redTeam: {
    backgroundColor: red[400],
  },
  textCenter: {
    textAlign: 'center'
  },
  rightPadFix: {
    paddingRight: 24    
  },
  root: {
    paddingRight: 2,
  },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
  fullWidth: {
    width: '100%'
  },
  scoreElementContainer: {
    padding: 24,
  },
  noDisplay: {
    display: 'none',
  },
  floatBottomRight: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  }
});