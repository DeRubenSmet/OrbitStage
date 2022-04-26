import { FormStrategy } from "remix-auth-form";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/services/session.server";
import { ActionFunction } from "logIn/packages/remix-server-runtime";
import invariant from "invariant";

// import { User, findOrCreateUser } from "~/models/user";
//@ts-ignore

export let authenticator = new Authenticator<User>(sessionStorage);
// The rest of the code above here...

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    // Here you can use `form` to access and input values from the form.
    // and also use `context` to access more things from the server
    let username = form.get("name"); // or email... etc
    let password = form.get("password");

    // You can validate the inputs however you want
    invariant(typeof username === "string", "username must be a string");
    invariant(username.length > 0, "username must not be empty");

    invariant(typeof password === "string", "password must be a string");
    invariant(password.length > 0, "password must not be empty");

    invariant(username === "Ruben", "wrong username");
    invariant(password === "0123", "wrong password")

    // And if you have a password you should hash it
    // let hashedPassword = await hash(password);

    // And finally, you can find, or create, the user
    let user = {name: username, password: password};

    // And return the user as the Authenticator expects it
    return user;
  })
);