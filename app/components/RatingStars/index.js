/**
*
* RatingStars
*
*/
import React from 'react';
import PropTypes from 'prop-types';

import IconButton from 'material-ui/IconButton';
import ActionGrade from 'material-ui-icons/Grade';
import amber from 'material-ui-next/colors/amber';
const amberA700 = amber.A700;


class RatingStars extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {

  	const { numberStars, rating } = this.props;

  	let content = [];
  	for (var i=1; i <= numberStars; i++) {
  		if(i <= rating){
  			content.push(
  				<IconButton key={i} touch={true} >
  					<ActionGrade color={amberA700} />
  				</IconButton>
  			);
  		} else{
  			content.push(
  				<IconButton key={i} touch={true} disabled={true}>
  					<ActionGrade />
  				</IconButton>
  			);
  		}	    
		}

    return (
      <div>
      	{ content }
      </div>
    );
  }
}

RatingStars.propTypes = {
	numberStars: PropTypes.number.isRequired,
	rating: PropTypes.number
};

export default RatingStars;