import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Form, Header, Modal, Input, Dropdown } from "semantic-ui-react";
import styles from "../styles/ProjectList.module.scss";
import CustomIcon from "./CustomIcon";
import cn from "classnames";
import { CREATE_PROJECT_MUTATION } from "../core/mutations";
import { useState } from "react";
import { useHistory } from "react-router";

function ProjectList() {
    const [createProjectOpen, setCreateProjectOpen] = useState(false);
    const [protocol, setProtocol] = useState("https://");
    const [errors, setErrors] = useState<any>({});
    const history = useHistory();

    const [createProject, result] = useMutation(CREATE_PROJECT_MUTATION, {
        onCompleted: (r) => {
            history.push(`/app/projects/${r.createProject.id}`);
        },
        onError: (err) => {
            console.log(err);
        }
    });

    const { data, loading, error } = useQuery(gql`
        {
            projects {
                id
                title
                comment
            }
        }
    `);

    function goToProject(id: string) {
        history.push(`/app/projects/${id}`);
    }

    function onSubmit(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        let form = ev.target as HTMLFormElement;

        let projectContent = {
            title: form.projectTitle.value as string,
            comment: form.projectComment.value as string,
        }

        let trackerContent = {
            title: form.trackerTitle.value,
            url: form.trackerUrl.value
        }

        let newErrors: any = {};
        if (!projectContent.title) {
            newErrors.title = "Indiquez le titre de votre projet";
        }

        if (!trackerContent.title && projectContent.title) {
            trackerContent.title = projectContent.title;
        }

        if (!trackerContent.url) {
            newErrors.trackerUrl = "Indiquez l'adresse du site internet à surveiller avec ce traqueur";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            return;
        }

        trackerContent.url = protocol + trackerContent.url;

        createProject({
            variables: {
                projectTitle: projectContent.title,
                projectComment: projectContent.comment,
                firstTrackerTitle: trackerContent.title,
                firstTrackerUrl: trackerContent.url
            }
        })
    }

    let httpOptions = [
        { key: "https", text: "https://", value: "https://" },
        { key: "http", text: "http://", value: "http://" },
    ]

    if (loading) {
        return <div>...chargement</div>
    }

    return <div className={styles.projectList}>
        <div className={styles.header}>
            <Header size="huge" className={styles.title}>Mes Projets</Header>
            <div className={styles.actions}>
                <Button color="orange" icon="add" onClick={() => setCreateProjectOpen(true)}>Nouveau Projet</Button>
            </div>
        </div>
        <div className={styles.grid}>
            {
                data.projects.map((p: any) => {
                    return <div key={p.id} className={styles.projectCard} onClick={() => goToProject(p.id)}>
                        <CustomIcon type="project" size={64} />
                        <div className={styles.card_content}>
                            <span className={styles.title}>{p.title}</span>
                            <span className={styles.comment}>{p.comment}</span>
                        </div>
                    </div>
                })
            }
            <div className={cn(styles.projectCreate, styles.projectCard)} onClick={() => setCreateProjectOpen(true)}>
                <CustomIcon type="add project" size={32} />
                <div className={styles.card_content}>
                    <span className={styles.title} data-tag="newProjectTitle">Nouveau projet</span>
                </div>
            </div>
        </div>
        <Modal open={createProjectOpen} onClose={() => setCreateProjectOpen(false)} className={styles.modal}>
            <Modal.Header style={{ background: 'transparent' }}>Créer un projet</Modal.Header>
            <Modal.Content style={{ background: 'transparent' }}>
                <Form onSubmit={onSubmit}>
                    <Form.Input inverted fluid error={errors.title} type="text" label="Titre de votre projet" name="projectTitle" required />
                    <Form.TextArea error={errors.comment} label="Commentaire" name="projectComment"></Form.TextArea>
                    <Header>Ajoutez votre premier traqueur à ce projet</Header>
                    <Input fluid error={errors.trackerUrl} type="text" label={
                        <Dropdown value={protocol} options={httpOptions} onChange={(ev, d) => setProtocol(d.value as string)} />} placeholder="Site à surveiller" name="trackerUrl" required />
                    <div style={{ height: '16px' }}></div>
                    <Form.Input fluid error={errors.trackerTitle} type="text" label="Titre du traqueur" name="trackerTitle" required />
                    <Form.Button loading={result.loading} disabled={result.loading} color="orange">
                        Créer le projet
                    </Form.Button>
                </Form>
            </Modal.Content>
        </Modal>
    </div>
}

export default ProjectList;