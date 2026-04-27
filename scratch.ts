import { auth } from "./src/lib/auth";

async function test() {
  try {
    const res = await auth.api.signInEmail({
      body: { email: "test@test.com", password: "wrong" },
      headers: new Headers(),
      asResponse: true
    });
    console.log(res);
  } catch (e) {
    console.log("Error:", e);
  }
}
