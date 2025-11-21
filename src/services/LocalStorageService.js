class LocalStorageService {
   set(key, value) {
     localStorage.setItem(key, value);
   }
 
   get(key) {
      const value = localStorage.getItem(key);
      try {
        return value; // Parse the value as JSON if it's a string
      } catch  {
        return null; // Return null if parsing fails
      }
   }
 
   remove(key) {
     localStorage.removeItem(key);
   }
 
   clear() {
     const remember = localStorage.getItem("remember");
     if(remember=="true"){
     const password = localStorage.getItem("password");
     localStorage.clear();
     localStorage.setItem("password", password);
     localStorage.setItem("remember", remember);
     }else{
     localStorage.clear();
     }
   }
 }
 
 export default new LocalStorageService();
 