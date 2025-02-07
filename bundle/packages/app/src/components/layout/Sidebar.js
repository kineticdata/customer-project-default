import React, { useCallback } from 'react';
import { connect } from 'react-redux';
import { Link, matchPath } from 'react-router-dom';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import {
  selectQueueKapp,
  selectServicesKapp,
  selectSurveyKapp,
  selectTechBarKapp,
  selectHasRoleSchedulerAdmin,
  selectHasRoleSchedulerManager,
  Utils,
} from '@kineticdata/bundle-common';
import { I18n } from '@kineticdata/react';
import classNames from 'classnames';
import QueueApp from '@kineticdata/bundle-queue';
import ServicesApp from '@kineticdata/bundle-services';
import SurveyApp from '@kineticdata/bundle-survey';
import TechBarApp from '@kineticdata/bundle-tech-bar';

const buildKappSettingsList = ({
  profile,
  queueKapp,
  servicesKapp,
  surveyKapp,
  techBarKapp,
}) =>
  [
    Utils.isKappManageable(queueKapp) &&
      QueueApp.settingsRoute && {
        label: `${queueKapp.name} Settings`,
        to: `/kapps/${queueKapp.slug}${QueueApp.settingsRoute}`,
      },
    Utils.isKappManageable(servicesKapp) &&
      ServicesApp.settingsRoute && {
        label: `${servicesKapp.name} Settings`,
        to: `/kapps/${servicesKapp.slug}${ServicesApp.settingsRoute}`,
      },
    Utils.isKappManageable(surveyKapp) &&
      SurveyApp.settingsRoute && {
        label: `${surveyKapp.name} Settings`,
        to: `/kapps/${surveyKapp.slug}${SurveyApp.settingsRoute}`,
      },
    (Utils.isKappManageable(techBarKapp) ||
      selectHasRoleSchedulerAdmin(profile) ||
      selectHasRoleSchedulerManager(profile)) &&
      TechBarApp.settingsRoute && {
        label: `${techBarKapp.name} Settings`,
        to: `/kapps/${techBarKapp.slug}${TechBarApp.settingsRoute}`,
      },
  ].filter(Boolean);

const SidebarComponent = props => {
  const SidebarLink = useCallback(
    ({ to, matchFn, matchParams = {}, matchExclude, icon, children }) => (
      <Link
        to={to}
        className={classNames({
          active:
            (typeof matchFn === 'function'
              ? matchFn(props.pathname)
              : matchPath(props.pathname, { path: to, ...matchParams })) &&
            (!matchExclude ||
              !matchPath(props.pathname, {
                path: matchExclude,
                ...matchParams,
              })),
        })}
        onClick={props.onSidebarAction}
      >
        <span className={icon} />
        <span className="title">{children}</span>
      </Link>
    ),
    [props.pathname, props.onSidebarAction],
  );

  const kappSettingsList = buildKappSettingsList({
    profile: props.profile,
    queueKapp: props.queueKapp,
    servicesKapp: props.servicesKapp,
    surveyKapp: props.surveyKapp,
    techBarKapp: props.techBarKapp,
  });

  return (
    <>
      <div className="app-sidebar__group app-sidebar__group--toggle">
        <button className="toggle" onClick={props.toggleSidebar}>
          <span
            className={classNames('fa', {
              'fa-bars': !props.mobile,
              'fa-chevron-left': props.mobile,
            })}
          />
        </button>
      </div>
      <div className="app-sidebar__group">
        <SidebarLink to="/" icon="fa fa-home" matchParams={{ exact: true }}>
          <I18n>Home</I18n>
        </SidebarLink>
        {Utils.isKappVisible(props.servicesKapp) && (
          <SidebarLink
            to={`/kapps/${props.servicesKapp.slug}/categories`}
            icon="fa fa-files-o"
          >
            <I18n>Service Catalog</I18n>
          </SidebarLink>
        )}

        {Utils.isKappVisible(props.queueKapp) && (
          <SidebarLink
            to={`/kapps/${props.queueKapp.slug}`}
            icon="fa fa-tasks"
            matchExclude={`/kapps/${props.queueKapp.slug}${
              QueueApp.settingsRoute
            }`}
          >
            <I18n>Queue</I18n>
          </SidebarLink>
        )}
        {Utils.isKappVisible(props.techBarKapp) && (
          <SidebarLink
            to={`/kapps/${props.techBarKapp.slug}`}
            icon="fa fa-clock-o"
            matchExclude={`/kapps/${props.techBarKapp.slug}${
              TechBarApp.settingsRoute
            }`}
          >
            <I18n>Tech Bar</I18n>
          </SidebarLink>
        )}
      </div>
      <div className="app-sidebar__group--divider" />
      <div className="app-sidebar__group">
        {Utils.isKappVisible(props.servicesKapp) && (
          <SidebarLink
            to={`/kapps/${props.servicesKapp.slug}/requests`}
            icon="fa fa-file-text-o"
          >
            <I18n>My Requests</I18n>
          </SidebarLink>
        )}
        {Utils.isKappVisible(props.servicesKapp) &&
          props.servicesFavoritesEnabled && (
            <SidebarLink
              to={`/kapps/${props.servicesKapp.slug}/favorites`}
              icon="fa fa-star-o"
            >
              <I18n>My Favorites</I18n>
            </SidebarLink>
          )}
        {props.surveyKapp && (
          <SidebarLink
            to={`/kapps/${props.surveyKapp.slug}/my-surveys`}
            icon="fa fa-pencil-square-o"
          >
            <I18n>My Surveys</I18n>
          </SidebarLink>
        )}
      </div>
      <div className="app-sidebar__group app-sidebar__group--static mt-auto">
        <div className="action-wrapper">
          <Link to="/settings">
            <span className="fa fa-cogs" />
            <span className="title">Settings</span>
          </Link>
          {kappSettingsList.length > 0 && (
            <UncontrolledDropdown
              direction={props.isSmallLayout ? 'up' : 'right'}
            >
              <DropdownToggle className="dropdown-toggle">
                <span className={classNames('fa fa-angle-right')} />
              </DropdownToggle>
              <DropdownMenu>
                {kappSettingsList.map(link => (
                  <DropdownItem tag={Link} to={link.to} key={link.label}>
                    <span className="title">{link.label}</span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          )}
        </div>
      </div>
    </>
  );
};

export const Sidebar = connect(state => ({
  space: state.app.space,
  profile: state.app.profile,
  kapps: state.app.kapps,
  queueKapp: selectQueueKapp(state),
  servicesKapp: selectServicesKapp(state),
  servicesFavoritesEnabled: Utils.hasProfileAttributeDefinition(
    state.app.space,
    'Services Favorites',
  ),
  surveyKapp: selectSurveyKapp(state),
  techBarKapp: selectTechBarKapp(state),
  pathname: state.router.location.pathname,
  isSmallLayout: state.layout.size === 'small',
}))(SidebarComponent);
