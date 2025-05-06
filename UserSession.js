
class UserSession {
    static instance = null;
  
    static getInstance() {
      if (!UserSession.instance) {
        UserSession.instance = new UserSession();
      }
      return UserSession.instance;
    }
  
    accessToken = null;
    refreshToken = null;
    userId = null;
    username = null;
    jobTitle = null;
    login = null;
    password = null;
    role = null;
  
    async refreshAccessToken() {
      try {
        const response = await fetch('https://localhost:7006/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: this.refreshToken,
        });
  
        const resText = await response.text();
  
        if (response.ok) {
          this.accessToken = resText;
        } else if (resText === 'LoginAgain') {
          // Обработка выхода из системы — например, навигация на экран логина
          console.warn('Срок действия токена истёк. Перенаправление на экран входа...');
          // Навигацию можно внедрить позже через callback
        }
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
      }
    }
  
    async sendAuthorizedRequest(requestFactory) {
      let request = requestFactory();
  
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
  
      let response = await fetch(request.url, request);
  
      if (response.status === 401) {
        await this.refreshAccessToken();
        request = requestFactory();
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${this.accessToken}`,
        };
        response = await fetch(request.url, request);
      }
  
      return response;
    }
  
    clear() {
      this.accessToken = null;
      this.refreshToken = null;
      this.username = null;
      this.jobTitle = null;
      this.login = null;
      this.password = null;
      this.role = null;
      this.userId = null;
    }
  }
  
  export default UserSession.getInstance();
  