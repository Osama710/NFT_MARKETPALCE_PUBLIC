import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import AppleProvider from "next-auth/providers/apple";

const GOOGLE_AUTHORIZATION_URL =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    prompt: "consent",
    access_type: "offline",
    response_type: "code",
  });

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: GOOGLE_AUTHORIZATION_URL,
    }),
    FacebookProvider({
      idToken: true,
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      wellKnown: "https://www.facebook.com/.well-known/openid-configuration",
      token: {
        url: "https://www.facebook.com/v11.0/dialog/oauth",
        params: { scope: "openid email public_profile" },
      },
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
  ],
  // callbacks: {
  //   async jwt({ token, user, account }) {
  //     // Initial sign in
  //     if (account && user) {
  //       return {
  //         accessToken: account.access_token,
  //         accessTokenExpires: Date.now() + account.expires_at * 1000,
  //         refreshToken: account.refresh_token,
  //         user,
  //       };
  //     }
  //     // // Return previous token if the access token has not expired yet
  //     // if (Date.now() < token.accessTokenExpires) {
  //     //   return token;
  //     // }
  //     // Access token has expired, try to update it
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     session.user = token.user;
  //     session.accessToken = token.accessToken;
  //     session.error = token.error;
  //     return session;
  //   },
  // },
  secret: process.env.NEXTAUTH_SECRET,
});

// {
/* <script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '{your-app-id}',
      cookie     : true,
      xfbml      : true,
      version    : '{api-version}'
    });
      
    FB.AppEvents.logPageView();   
      
  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script> */

// FB.getLoginStatus(function(response) {
//   statusChangeCallback(response);
// });

// {
/* <fb:login-button 
  scope="public_profile,email"
  onlogin="checkLoginState();">
</fb:login-button>

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
} */
// }
