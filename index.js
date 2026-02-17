import db from "./db/index.js";
import { usersTable }  from "./drizzle/schema.js";
import { eq } from "drizzle-orm";
import dotenv from 'dotenv';
dotenv.config(); 


async function getAllUsers(){
const users = await db.select().from(usersTable);
console.log("Users in db ",users);
return users ;

}

async function createUser({id , name, age, email}){
const user = await db.insert(usersTable).values({id ,name, age, email });
console.log("User created:", user);
return user;
}


async function deleteUser(id){
const deletedUser = await db.delete(usersTable).where(eq(usersTable.id, id));
console.log("User deleted:", deletedUser);
return deletedUser;
}


try {
getAllUsers();
createUser({id: 1 , name: "John Doe", age: 30, email: "john.doe@example.com"})
.then(() => getAllUsers())
} catch (error) {
    console.error("Error occurred while managing users:", error);
}
