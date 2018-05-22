const configure = (client, logger) => {
  // eslint-disable-next-line no-param-reassign
  client.defaults.validateStatus = status => status < 500;
  client.interceptors.request.use(
    config => {
      logger.debug(`request: ${JSON.stringify(config)}`);
      return config;
    },
    error => {
      logger.error(error.message);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    res => {
      logger.debug(
        `response: ${JSON.stringify({
          data: res.data,
          status: res.status,
          statusText: res.statusText,
          headers: res.headers,
        })}`
      );
      return res;
    },
    error => {
      logger.error(error.message);
      return Promise.reject(error);
    }
  );

  return client;
};

module.exports = configure;
