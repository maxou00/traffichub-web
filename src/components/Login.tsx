import { Link, useHistory } from "react-router-dom";
import React from "react";
import styles from "../styles/Login.module.scss";
import { Form } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import { SIGNIN_MUTATION } from "../core/mutations";
import { AUTH_TOKEN } from "../core";
import { appState } from "../core/AppState";

export default function Login() {
    const [loading, setLoading] = React.useState(false);
    const [formState, setFormState] = React.useState<any>({});
    const [errors, setErrors] = React.useState<any>({});

    const router = useHistory();

    const [login, result] = useMutation(SIGNIN_MUTATION, {
        variables: formState,
        onCompleted: async ({ signin }) => {
            console.log(signin);
            appState.setUser(signin.profile)
            localStorage.setItem(AUTH_TOKEN, signin.token);
            setTimeout(() => {
                setLoading(false);
                router.replace("/app");
            }, 2000);
        },
        onError: (err) => {
            console.log(err);
            setLoading(false);
        }
    })

    function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        let form = ev.target as HTMLFormElement
        let values = {
            email: form.email.value as string,
            password: form.password.value as string
        }
        let newErrors: any = {};
        if (!values.email) {
            newErrors.email = "Indiquez votre email";
        }
        if (!values.password || values.password.length < 8) {
            newErrors.password = "Votre mot de passe doit contenir au moins 08 caractères";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setFormState(values);
        setLoading(true);
        login({ variables: values });
    }

    return <div className={styles.login}>
        <div className={styles.left}>
            <div className={styles.create_account}>
                <h1>Démarrez avec TrafficHub</h1>
                <div style={{ height: '16px' }}></div>
                <span>Commencez à optimiser vos sites, suivez votre traffic en temps réel et boostez votre productivité.</span>
                <div style={{ height: '32px' }}></div>
                <div className={styles.actions}>
                    <Link to="/signup"><span className={styles.create}>commencer</span></Link>
                </div>
            </div>
        </div>
        <div className={styles.content_wrapper}>
            <div className={styles.content}>
                <div className={styles.logo_row}>
                    <h1>TrafficHub</h1>
                </div>
                <div style={{ height: '32px' }}></div>
                <h2>Connectez-vous à votre compte</h2>
                <div style={{ height: '32px' }}></div>
                <Form onSubmit={onSubmit} className={styles.login_form}>
                    <Form.Input error={errors.email} name="email" type="email" label="Adresse électronique" />
                    <div style={{ height: '8px' }}></div>
                    <Form.Input error={errors.password} name="password" type="password" label="Mot de passe" />
                    <div style={{ height: '32px' }}></div>
                    <Form.Button loading={loading} disabled={loading} fluid color='blue' type="submit">Connexion</Form.Button>
                    <div style={{ height: '32px' }}></div>
                    <div className={styles.helps}>
                        <Link to="/forgotten-password">Mot de passe oublié ?</Link>
                        <Link to="/signup">Pas de compte ? commençer</Link>
                    </div>
                </Form>
            </div>
        </div>
    </div>
}