


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
    static onLogoutCallback = null;

    setLogoutCallback(callback) {
      this.onLogoutCallback = callback;
    }

    async refreshAccessToken() {
      try {
        const response = await fetch('http://192.168.2.62:7006/refresh-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: this.refreshToken,
        });
        
        const resText = await response.text();
        

        if (response.ok) {
          this.accessToken = resText;
        } else if (response.status === 401) {
          
          console.warn('Срок действия токена истёк. Перенаправление на экран входа...');
          this.clear(); // очистим сессию
          if (this.onLogoutCallback) this.onLogoutCallback();
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
        console.log(this.accessToken+"токен");

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
  