server-nodejs
=============

### Deployment

Running on ai1dev2.kinisi.cc, port 3000.

```
    $ nohup node app.js 3000 &
```

### Dependencies

Connects to ai1dev2's MySQL instance, uses the `oauth_token` table.


### Demonstration

1. Goto: http://ai1dev2.kinisi.cc:3000/auth/google
2. Sign-in to Google+
3. Click the link at the end of debug output.
  1. Tada, you have your Kinisi API_Token
  2. Try removing the `token=...` querystring: it should not return data. (demonstrates security)
