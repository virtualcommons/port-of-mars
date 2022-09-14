type Form = {
  name: string;
  email: string;
  consent: boolean;
};

export async function loginWithEmail(email: string) {
  try {
    const response = await useFetch("/api/auth/login", {
      method: "POST",
      body: { email },
    });
    if (response) {
      useState("user").value = response;
      await useRouter().push("/consent");
    }
  } catch (error) {
    console.log("error: " + email.toString());
  }
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
