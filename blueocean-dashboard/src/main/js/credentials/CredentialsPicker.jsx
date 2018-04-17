import React, { PropTypes } from 'react';

import GitCredentialsPicker from './git/GitCredentialsPicker';
import GithubCredentialsPicker from './github/GithubCredentialsPicker';
import BbCredentialsPicker from './bitbucket/BbCredentialsPicker';

/**
 * Provides UI and backend integration for acquiring a credential.
 * type: 'github', 'github-enterprise', 'bitbucket-cloud', 'bitbucket-server'
 * onStatus: function invoked with 'promptLoading', 'promptReady'
 * onComplete: function invoked with credential and 'autoSelected', 'userSelected'
 */
class CredentialsPicker extends React.Component {
    resolveType(props) {
        if (props.type) {
            return props.type;
        }
        if (props.scmSource && props.scmSource.id) {
            return props.scmSource.id;
        }
        return null;
    }

    resolveScmSource(props) {
        if (props.scmSource) {
            return props.scmSource;
        }
        if (props.githubConfig) {
            return {
                id: props.githubConfig.scmId,
                apiUrl: props.githubConfig.apiUrl,
            };
        }
        return {};
    }

    render() {
        console.log('CredentialsPicker render()'); // TODO: RM
        const type = this.resolveType(this.props);
        const scmSource = this.resolveScmSource(this.props);

        console.log('                 scmSource', JSON.stringify(scmSource, null, 4)); // TODO: RM
        console.log('                      type', type); // TODO: RM

        let children = null;

        if (type === 'github' || type === 'github-enterprise') {
            console.log('CredentialsPicker render A'); // TODO: RM
            children = <GithubCredentialsPicker scmId={scmSource.id} apiUrl={scmSource.apiUrl} />;
        } else if (type === 'bitbucket-cloud' || type === 'bitbucket-server') {
            console.log('CredentialsPicker render B'); // TODO: RM
            children = <BbCredentialsPicker scmId={scmSource.id} apiUrl={scmSource.apiUrl} />;
        } else if (type === 'git') {
            const repositoryUrl = this.props.repositoryUrl || scmSource.apiUrl;
            console.log('CredentialsPicker render C'); // TODO: RM
            children = <GitCredentialsPicker repositoryUrl={repositoryUrl} />;
        } else {
            console.log('CredentialsPicker render D'); // TODO: RM
            children = <div>No credential picker could be found for type={type}</div>;
        }

        return <div className="credentials-picker">{React.cloneElement(children, this.props)}</div>;
    }
}

CredentialsPicker.propTypes = {
    type: PropTypes.string,
    onStatus: PropTypes.func,
    onComplete: PropTypes.func,
    requirePush: PropTypes.bool,
    branch: PropTypes.string,
    dialog: PropTypes.bool,
    pipeline: PropTypes.object,
    repositoryUrl: PropTypes.string,
    existingFailed: PropTypes.bool,
    scmSource: PropTypes.shape({
        id: PropTypes.string,
        apiUrl: PropTypes.string,
    }),
    githubConfig: PropTypes.shape({
        scmId: PropTypes.string,
        apiUrl: PropTypes.string,
    }),
};

export default CredentialsPicker;
