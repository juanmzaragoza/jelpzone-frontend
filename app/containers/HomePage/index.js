/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link} from 'react-router-dom';
import { createStructuredSelector } from 'reselect';

import { isEmpty } from 'lodash';

import ServicesMap from 'components/ServicesMap';
import PopupContent from 'components/ServicesMap/PopupContent';
import VerticalIconsMenu from 'components/VerticalIconsMenu/Loadable';
import ProfessionalInformation from 'components/ProfessionalInformation/Loadable';
import ProfessionalInformationList from 'components/ProfessionalInformationList/Loadable';
import ProfessionalInformationPanel from 'components/ProfessionalInformationPanel/Loadable';
import RatingStars from 'components/RatingStars';
import DescriptionList from 'components/DescriptionList';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';

import Paper from 'material-ui/Paper';
import Grid from 'material-ui-next/Grid';
import Typography from 'material-ui-next/Typography';
import { withStyles } from 'material-ui-next/styles';
import List, {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
} from 'material-ui-next/List';
import Avatar from 'material-ui-next/Avatar';
import IconButton from 'material-ui-next/IconButton';

import RemoveRedEye from 'material-ui-icons/RemoveRedEye';
import PersonAdd from 'material-ui-icons/PersonAdd';
import ThumbUpIcon from 'material-ui-icons/ThumbUp';
import ThumbDownIcon from 'material-ui-icons/ThumbDown';
import PersonIcon from 'material-ui-icons/Person';

import green from 'material-ui-next/colors/green';

import { toggleProfessionalExtraInformation } from './actions';
import { makeSelectUserExtraInformation } from './selectors';
import reducer from './reducer';
import saga from './saga';

import { FormattedMessage } from 'react-intl';
import messages from './messages';

import './HomePage.css'; // Tell Webpack that HomePage.js uses these styles

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  personalInformation: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  flexContainer: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  ratingStar: {
    display: 'inline',
  },
  greenAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: green[500],
  },
});

export class HomePage extends React.Component {

  /*
   * TODO: DELETE FROM HERE
   * Example of movement
   * Only to show how map updates
   */
  constructor(props){
    super(props);
    this.state = {
      professionals: [
        {
          id: 1,
          latitude: -34.62,
          longitude: -58.42,
        },
        {
          id: 2,
          latitude: -34.63,
          longitude: -58.44,
        },
        {
          id: 3,
          latitude: -34.61,
          longitude: -58.45,
        },
        {
          id: 4,
          latitude: -34.62,
          longitude: -58.41,
        },
        {
          id: 5,
          latitude: -34.61,
          longitude: -58.40,
        },
      ]
    };
  }

  updateProfessionals() {

    var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
    var plusOrMinus2 = Math.random() < 0.5 ? -1 : 1;
    var binary1 = Math.random() < 0.5 ? 0 : 1;
    var binary2 = Math.random() < 0.5 ? 0 : 1;

    this.setState({
      professionals: [
        {
          id: 1,
          latitude: this.state.professionals[0].latitude + 0.0001*binary1*plusOrMinus1,
          longitude: this.state.professionals[0].longitude + 0.0001*binary1*plusOrMinus2,
          popupBody: <PopupContent />
        },
        {
          id: 2,
          latitude: this.state.professionals[1].latitude + 0.0001*binary2*plusOrMinus2,
          longitude: this.state.professionals[1].longitude + 0.0001*binary2*plusOrMinus1,
        },
        {
          id: 3,
          latitude: this.state.professionals[2].latitude + 0.0001*binary2*plusOrMinus2,
          longitude: this.state.professionals[2].longitude + 0.0001*plusOrMinus1*plusOrMinus1,
        },
        {
          id: 4,
          latitude: this.state.professionals[3].latitude + 0.0001*binary2*plusOrMinus2,
          longitude: this.state.professionals[3].longitude + 0.0001*plusOrMinus1*plusOrMinus1,
        },
        {
          id: 5,
          latitude: this.state.professionals[4].latitude + 0.0001*binary2*plusOrMinus2,
          longitude: this.state.professionals[4].longitude + 0.0001*plusOrMinus1*plusOrMinus1,
        },
      ]
    });

  }

  componentWillMount(){
    this.updateProfessionals();
  }

  componentDidMount(){
    /*this.loadInterval = window.setInterval(function () {
      this.updateProfessionals();
    }.bind(this), 3000);*/
  }

  componentWillUnmount () {
    window.clearInterval(this.loadInterval);
  }
  /*
   * TO HERE
   */

  render() {

    const menuItems = [
      {
        id: 1,
        icon: <RemoveRedEye />,
        value: 1,
      },
      {
        id: 2,
        icon: <PersonAdd />,
        value: 2,
      },
    ],
          { classes } = this.props;

    return (
      <div className={classes.root} >
        <Grid container justify={'center'}>
          <Grid item xs={12} sm={7}> {/* Container map */}
            <ServicesMap marks={this.state.professionals}
              onMarkerClick={this.props.toggleExtraInformation}
            >
              <div className="left-container-md left-container-xs"  >
                <VerticalIconsMenu items={menuItems} onItemClick={(value) => console.log(value)} />
              </div>
            </ServicesMap>
          </Grid>
          <Grid item xs={12} sm={5}> {/* Container professionals list */}
            <ProfessionalInformationList professionals={this.state.professionals} />
          </Grid>

          {
            (this.props.userExtraInformation.size>0) ?
              <Grid item xs={12} sm={12} > {/* Extra information container */}
                <Grid container justify={'center'} direction={'column'} >
                  <Grid item > {/* Personal information */}
                    <Paper className={classes.personalInformation} elevation={4}>
                      <ProfessionalInformation professional={this.props.userExtraInformation} />
                    </Paper>
                  </Grid>
                  <Grid item > {/* Reputation Panel */}
                    <ProfessionalInformationPanel
                      heading={<FormattedMessage {...messages.reputationHeader} />}
                      secondaryHeading={<RatingStars numberStars={5} rating={1}/>}
                    >
                      {/* Reputation Content */}
                      <DescriptionList
                        direction={'column'}
                        itemXs={6}
                        itemSm={3}
                        fieldXs={6}
                      >
                        <Typography variant="title" gutterBottom>
                          65
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          Requests
                        </Typography>

                        <Typography variant="title" gutterBottom>
                          12
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          Trabajos realizados
                        </Typography>

                        <Typography variant="title" gutterBottom>
                          89%
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          de sus clientes lo recomiendan
                        </Typography>

                        <Typography variant="title" gutterBottom>
                          11 min
                        </Typography>
                        <Typography variant="caption" gutterBottom>
                          Tiempo promedio de respuesta
                        </Typography>
                      </DescriptionList>


                      {/*<DescriptionList
                        direction={'row'}
                        itemXs={12}
                        itemSm={12}
                        fieldXs={6}
                      >
                        <span>Punctuallity </span>
                        <RatingStars numberStars={5} rating={5} className={classes.ratingStar} />

                        <span>Prolixity </span>
                        <RatingStars numberStars={5} rating={4} className={classes.ratingStar} />

                        <span>Knowledge </span>
                        <RatingStars numberStars={5} rating={3} className={classes.ratingStar} />

                        <span>Tools </span>
                        <RatingStars numberStars={5} rating={2} className={classes.ratingStar} />

                        <span>Reply </span>
                        <RatingStars numberStars={5} rating={1} className={classes.ratingStar} />
                      </DescriptionList>*/}

                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Punctuallity "
                            secondary={<RatingStars numberStars={5} rating={5} className={classes.ratingStar} />}
                            disableTypography
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Prolixity "
                            secondary={<RatingStars numberStars={5} rating={4} className={classes.ratingStar} />}
                            disableTypography
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Knowledge "
                            secondary={<RatingStars numberStars={5} rating={3} className={classes.ratingStar} />}
                            disableTypography
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Tools "
                            secondary={<RatingStars numberStars={5} rating={2} className={classes.ratingStar} />}
                            disableTypography
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Reply "
                            secondary={<RatingStars numberStars={5} rating={1} className={classes.ratingStar} />}
                            disableTypography
                          />
                        </ListItem>
                      </List>
                    </ProfessionalInformationPanel>
                    <ProfessionalInformationPanel
                      heading={<FormattedMessage {...messages.usersQualificationHeader} />}
                      secondaryHeading={<Typography className={classes.secondaryHeading}><FormattedMessage {...messages.usersQualificationSubheading} /></Typography>}
                    >
                      <List >
                        {generate(
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar className={classes.greenAvatar}>
                                <ThumbUpIcon />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary="Lorem ipsum dolor sit amet, "
                              secondary="27 de Enero de 2018 a las 18:34 hs"
                            />
                            <ListItemSecondaryAction>
                              <IconButton aria-label="Delete">
                                <PersonIcon />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        )}
                      </List>
                    </ProfessionalInformationPanel>
                  </Grid>
                </Grid>
              </Grid>
              :
              null
          }

        </Grid>
      </div>
    )
  }
}

function generate(element) {
  return [0, 1, 2].map(value =>
    React.cloneElement(element, {
      key: value,
    }),
  );
}


HomePage.propTypes = {
  userExtraInformation: PropTypes.object,
}

HomePage = withStyles(styles)(HomePage);

export function mapDispatchToProps(dispatch) {
  return {
    onSubmitForm: (evt) => {
      if (evt !== undefined && evt.preventDefault) {
        evt.preventDefault();
      }
      dispatch(submitLoginForm(evt));
    },
    toggleExtraInformation: (evt) => {
      dispatch(toggleProfessionalExtraInformation(evt.cunstomId));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  userExtraInformation: makeSelectUserExtraInformation(),
  //error: makeSelectError(),
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect
)(HomePage);
