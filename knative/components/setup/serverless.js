'use strict';

// TODO: move this code into a `setup` method of the dedicated Components

const path = require('path');
const { mergeDeepRight } = require('ramda');
// eslint-disable-next-line camelcase
const { KubeConfig, Client1_13 } = require('kubernetes-client');
const { Component } = require('@serverless/core');

const defaults = {
  // TODO: we might want to pass this in via `context.credentials`
  kubeConfigPath: path.join(process.env.HOME, '.kube', 'config'),
  version: '1.13',
};

class KnativeSetup extends Component {
  async default(inputs = {}) {
    const config = mergeDeepRight(defaults, inputs);

    const client = this.getClient(config.kubeConfigPath);

    await this.install;
    await this.getNamespaces(client);

    this.state = config;

    await this.save();
    return this.state;
  }

  async remove() {
    this.context.status('Knative - Setup - remove()');

    this.state = {};

    await this.state();
    return {};
  }

  // "private" methods
  getClient(configPath, version) {
    const kubeconfig = new KubeConfig();
    kubeconfig.loadFromFile(configPath);
    const Request = require('kubernetes-client/backends/request');
    const backend = new Request({ kubeconfig });
    // TODO: this should be variable since the version number might change
    return new Client1_13({ backend, version });
  }

  async getNamespaces(client) {
    const res = await client.api.v1.namespaces.get();
    // eslint-disable-next-line no-console
    console.log(res);
  }
}

module.exports = KnativeSetup;
