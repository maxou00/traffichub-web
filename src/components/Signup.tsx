import React from "react";
import styles from "../styles/Login.module.scss";
import { Form } from "semantic-ui-react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";

export default function Signup() {
    const [loading, setLoading] = React.useState(false);
    const [gender, setGender] = React.useState("male");
    const [errors, setErrors] = React.useState<any>({});
    const router = useHistory();

    function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        let form = ev.target as HTMLFormElement;
        let signup = {
            firstName: form.firstName.value as string,
            lastName: form.lastName.value as string,
            gender,
            email: form.email.value as string,
            password: form.password.value as string,
            confirmPassword: form.confirmPassword.value as string
        }
        let newErrors: any = {};

        if (!signup.firstName) {
            newErrors.firstName = "Indiquez votre prénom";
        }
        if (!signup.lastName) {
            newErrors.lastName = "Indiquez votre nom";
        }
        if (!signup.email) {
            newErrors.email = "Indiquez votre email";
        }
        if (!signup.password || signup.password.length < 8) {
            newErrors.password = "Votre mot de passe doit contenir au moins 08 caractères";
        }
        if (signup.password) {
            if (signup.password !== signup.confirmPassword) {
                newErrors.confirmPassword = "Le mot de passe confirmé doit correspondre au mot de passe indiqué";
            }
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setLoading(true);
        fetch(
            "/api/auth/signup",
            {
                body: JSON.stringify(signup),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        )
            .then((res) => res.json())
            .then((done) => {
                setLoading(false);
                if (done.success) {
                    if (window) {
                        window.localStorage.setItem("profile", JSON.stringify(done.data.profile));
                        window.localStorage.setItem("token", done.data.token);
                    }
                    router.replace("/app/dashboard");
                }
                else {
                    setErrors(done.errors);
                }
            })
    }

    return <div className={styles.login}>
        <div className={styles.left}>
            <div className={styles.create_account}>
                <h1>Démarrez avec TrafficHub</h1>
                <div style={{ height: '16px' }}></div>
                <span>Commencez à optimiser vos sites, suivez votre traffic en temps réel, et obtenez vos rapports en temps réel.</span>
                <div style={{ height: '32px' }}></div>
                <div className={styles.actions}>
                    <Link to="/login"><span className={styles.create}>Me connecter</span></Link>
                </div>
            </div>
        </div>
        <div className={styles.content_wrapper}>
            <div className={styles.content}>
                <div className={styles.logo_row}>
                    <h1>TrafficHub</h1>
                </div>
                <div style={{ height: '32px' }}></div>
                <h2>C'est parti !</h2>
                <div style={{ height: '32px' }}></div>
                <Form className={styles.login_form} onSubmit={onSubmit}>
                    <Form.Input error={errors.firstName} fluid label="Prénom" placeholder="John" type="text" name="firstName" />
                    <Form.Input error={errors.lastName} fluid label="Nom" placeholder="Doe" type="text" name="lastName" />
                    <Form.Select error={errors.gender} fluid label="Genre" value={gender} onChange={(ev, sel) => setGender(sel.value as string)} options={[
                        { key: "m", text: "Homme", value: "male" },
                        { key: "f", text: "Femme", value: "female" }
                    ]} />
                    <div style={{ height: '8px' }}></div>
                    <Form.Input error={errors.email} fluid label="Adresse électronique" type="email" name="email" placeholder="johndoe@platform.io" />
                    <div style={{ height: '8px' }}></div>
                    <Form.Input error={errors.password} fluid label="Mot de passe" type="password" name="password" />
                    <div style={{ height: '8px' }}></div>
                    <Form.Input error={errors.confirmPassword} fluid label="Confirmez votre mot de passe" type="password" name="confirmPassword" />
                    <div style={{ height: '24px' }}></div>
                    <Form.Button fluid loading={loading} type="submit" color="blue" >Créer mon compte</Form.Button>
                    <div style={{ height: '32px' }}></div>
                    <div className={styles.helps}>
                        <Link to="/login">Déjà inscrit? Connectez-vous</Link>
                    </div>
                </Form>
            </div>
        </div>
    </div>
}