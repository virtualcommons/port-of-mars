type Form = {
  name: string;
  email: string;
  consent: boolean;
};

export async function loginWithEmail(email: string) {
  const { data: token } = await useFetch("/api/auth/login", {
    method: "POST",
    body: { email },
  });

  console.log("json web token?");
  console.log("token: ", token);
  // const cookie = useCookie("authtoken", { httpOnly: true });
  // cookie.value = token;
  // console.log("cookie: ", cookie.value);
  // console.log("token: ", token);
  return token;
}

export async function registerWithEmail(form: Form) {
  try {
    const response = await useFetch("/api/auth/register", {
      method: "POST",
      body: { form },
    });

    if (response) {
      useState("user").value = response;
      await useRouter().push("/dashboard");
    }
  } catch (error) {
    console.log("error: " + form.toString());
  }
}

export async function logout() {
  useRouter().push("/login");
}
