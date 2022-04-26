import { PrismaClient } from "@prisma/client";
import { ActionFunction, Form } from "remix";
import { authenticator } from "~/services/auth.server";

export default function Test() {
  return (
    <>
      <Form id="form" method='post'>
        <label>
          Name:    
          <span style={{'marginRight': 30}}></span>
          <input type="text" name="name" />
        </label>
        <br/>
        <label className='password'>
          Password:
          <span style={{'marginRight': 7}}></span>
          <input type="text" name="password" />
        </label>
        <br/>
        <input type="submit" value="Submit" />
      </Form>
    </>
  );
}

export async function loader(){
  const prisma = new PrismaClient();
  const allUsers = await prisma.contact.findMany();
  console.log("allUsers", allUsers);
  await prisma.$disconnect();
  return allUsers;
}


export const action: ActionFunction = async ({ request, context }) => {
  return await authenticator.authenticate("form", request, {
    
    successRedirect: "/provinces",
    failureRedirect: "http://localhost:3000/logIn",
    context, // optional
  });
};

export let action2: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/logIn" });
};