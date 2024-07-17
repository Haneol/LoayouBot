const axios = require("axios");
const logger = require("../utils/logger");

class ApiUtil {
  constructor(baseURL, apiKey) {
    this.api = axios.create({
      baseURL: baseURL,
      headers: {
        accept: "application/json",
        authorization: `bearer ${apiKey}`,
      },
    });

    // 응답 인터셉터 추가
    this.api.interceptors.response.use(
      (response) => response,
      this.handleApiError.bind(this)
    );
  }

  async handleApiError(error) {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized 에러 처리
      logger.info("Authentication failed. Attempting to refresh token...");
      try {
        await userController.setApiKeyRequest(interaction);
      } catch (refreshError) {
        logger.error("Failed to refresh token:", refreshError);
        throw refreshError;
      }
    }
    throw error;
  }

  async get(url, config = {}) {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      logger.error(`GET request failed for ${url}:`, error);
      throw error;
    }
  }

  async post(url, data, config = {}) {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      logger.error(`POST request failed for ${url}:`, error);
      throw error;
    }
  }
}

module.exports = ApiUtil;
