import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getCurrentProfile } from '../../redux/actions/profileActions';
import Spinner from '../layout/Spinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const { user } = auth;
  const profileState = useSelector(state => state.profile);
  const { loading, profile } = profileState;
  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);

  return loading && !profile ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Welcome {user && user.name}
      </p>
      {profile ? (
        <Fragment>Has Profile</Fragment>
      ) : (
        <Fragment>
          <p>You have have not yet set up a profile.</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Dashboard;
