import React, { useEffect, useState } from 'react'
import { useParams, Outlet } from 'react-router-dom'

export const initProjectDetailsState: ProjectDetails = {
    account_name: '',
    devs: [],
    lead_dev_id: '',
    project_type_id: '',
    qa: [],
    actual_working_hrs: 0,
    total_working_hrs: 0,
    agency_review: '',
    client_review: '',
    cms_doc: '',
    design_link: '',
    site_launched: '',
}

export const initDevSiteState: ProjectDevSite = {
    dev_site_wpe_acct: '',
    dev_site_url: '',
    dev_site_wp_admin_username: '',
    dev_site_wp_admin_password: '',
    dev_site_basic_auth_username: '',
    dev_site_basic_auth_password: '',
    dev_site_git_repository: '',
    dev_site_git_branch: '',
    dev_site_pipelines: '',
}

export const initStageSiteState: ProjectStageSite = {
    stage_site_wpe_acct: '',
    stage_site_url: '',
    stage_site_wp_admin_username: '',
    stage_site_wp_admin_password: '',
    stage_site_basic_auth_username: '',
    stage_site_basic_auth_password: '',
    stage_site_git_repository: '',
    stage_site_git_branch: '',
    stage_site_pipelines: '',
}

export const initProdSiteState: ProjectProdSite = {
    prod_site_wpe_acct: '',
    prod_site_url: '',
    prod_site_wp_admin_username: '',
    prod_site_wp_admin_password: '',
    prod_site_basic_auth_username: '',
    prod_site_basic_auth_password: '',
    prod_site_git_repository: '',
    prod_site_git_branch: '',
    prod_site_pipelines: '',
}

export const initStateProjClientLogins: ProjectClientLogins = {
    client_password: '',
    client_password2: '',
    client_site_name: '',
    client_site_name2: '',
    client_url: '',
    client_url2: '',
    client_username: '',
    client_username2: '',
}

export const devSiteFields = [
    { id: 'dev_site_wpe_acct', label: 'WPEngine account:', placeholder: 'Enter wpengine account' },
    { id: 'dev_site_url', label: 'URL:', placeholder: 'Enter url' },
    { id: 'dev_site_wp_admin_username', label: 'WP Admin Username:', placeholder: 'Enter wp username' },
    { id: 'dev_site_wp_admin_password', label: 'WP Admin Password:', placeholder: 'Enter wp password' },
    { id: 'dev_site_basic_auth_username', label: 'Basic Auth Username:', placeholder: 'Enter basic auth username' },
    { id: 'dev_site_basic_auth_password', label: 'Basic Auth Password:', placeholder: 'Enter basic auth password' },
    { id: 'dev_site_git_repository', label: 'GIT:', placeholder: 'Enter git repository' },
    { id: 'dev_site_git_branch', label: 'GIT Branch:', placeholder: 'Enter git branch' },
    { id: 'dev_site_pipelines', label: 'Pipelines:', placeholder: 'Enter pipelines' },
];

export const stageSiteFields = [
    { id: 'stage_site_wpe_acct', label: 'WPEngine account:', placeholder: 'Enter wpengine account' },
    { id: 'stage_site_url', label: 'URL:', placeholder: 'Enter url' },
    { id: 'stage_site_wp_admin_username', label: 'WP Admin Username:', placeholder: 'Enter wp username' },
    { id: 'stage_site_wp_admin_password', label: 'WP Admin Password:', placeholder: 'Enter wp password' },
    { id: 'stage_site_basic_auth_username', label: 'Basic Auth Username:', placeholder: 'Enter basic auth username' },
    { id: 'stage_site_basic_auth_password', label: 'Basic Auth Password:', placeholder: 'Enter basic auth password' },
    { id: 'stage_site_git_repository', label: 'GIT:', placeholder: 'Enter git repository' },
    { id: 'stage_site_git_branch', label: 'GIT Branch:', placeholder: 'Enter git branch' },
    { id: 'stage_site_pipelines', label: 'Pipelines:', placeholder: 'Enter pipelines' },
];

export const prodSiteFields = [
    { id: 'prod_site_wpe_acct', label: 'WPEngine account:', placeholder: 'Enter wpengine account' },
    { id: 'prod_site_url', label: 'URL:', placeholder: 'Enter url' },
    { id: 'prod_site_wp_admin_username', label: 'WP Admin Username:', placeholder: 'Enter wp username' },
    { id: 'prod_site_wp_admin_password', label: 'WP Admin Password:', placeholder: 'Enter wp password' },
    { id: 'prod_site_basic_auth_username', label: 'Basic Auth Username:', placeholder: 'Enter basic auth username' },
    { id: 'prod_site_basic_auth_password', label: 'Basic Auth Password:', placeholder: 'Enter basic auth password' },
    { id: 'prod_site_git_repository', label: 'GIT:', placeholder: 'Enter git repository' },
    { id: 'prod_site_git_branch', label: 'GIT Branch:', placeholder: 'Enter git branch' },
    { id: 'prod_site_pipelines', label: 'Pipelines:', placeholder: 'Enter pipelines' },
];
