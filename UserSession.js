class UserSession { //Данные о сессии
    static instance = null;
    static getInstance() {
      if (!UserSession.instance) {
        UserSession.instance = new UserSession(); //Создание статического класса
      }
      return UserSession.instance;
    }
    accessToken = null; //аксес токен
    refreshToken = null; //рефреш токен
    userId = null; //айди пользователя
    username = null; //имя пользователя
    jobTitle = null; //должность
    login = null; //логин 
    password = null; //пароль
    role = null; //роль
    static onLogoutCallback = null;
    setLogoutCallback(callback) { //Перенаправление на экран логина
      this.onLogoutCallback = callback;
    }
    async refreshAccessToken() {
      try {
        const response = await fetch('http://192.168.2.62:7006/refresh-token', { //обновить токен
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
          if (this.onLogoutCallback) this.onLogoutCallback(); //Перенаправление на экран логина
        }
      } catch (error) {
        console.error('Ошибка обновления токена:', error);
      }
    }
    async sendAuthorizedRequest(requestFactory) { //Отправка авторизованного запроса
      let request = requestFactory();
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${this.accessToken}`,
      };
      let response = await fetch(request.url, request);
      if (response.status === 401) { //Не авторизован
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
    clear() { //Очистка сессии
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
  