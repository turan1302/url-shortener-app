class AppUrl {
  static baseURL = 'http://localhost:3000';

  static shortenUrl = `${AppUrl.baseURL}`;
  static createLink = `${AppUrl.baseURL}/link/create`;
  static removeUrl = `${AppUrl.baseURL}/link/remove`;
  static getLinkStats = `${AppUrl.baseURL}/link/stats`;
  static changeStatus = `${AppUrl.baseURL}/link/change-status`;
  

}

export default AppUrl;
