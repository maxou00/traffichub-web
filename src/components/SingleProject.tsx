import { gql, useQuery } from "@apollo/client";
import { useState } from "react";
import styles from "../styles/Singleproject.module.scss";
import { Button, Header, List } from "semantic-ui-react";
import { useHistory } from "react-router";
import TrackingPoint from "./TrackingPoint";
import cn from "classnames";

interface Props {
    id: string;
}

function SingleProject(props: Props) {
    const [selectedTracker, setSelectedTracker] = useState<any>(undefined);
    const history = useHistory();
    const { data, loading, error } = useQuery(gql`
        {
            project(id: "${props.id}") {
                id
                title
                comment
                trackers {
                    id
                    title
                    url
                    tag
                }
            }
        }
    `);

    function goToSingleTracker(tracker: any) {
        setSelectedTracker(tracker);
    }

    if (loading) {
        return <p>...chargement</p>
    }
    return <div className={styles.page}>
        <div className={styles.page__content}>
            {
                selectedTracker &&
                <TrackingPoint tracker={selectedTracker} project={data.project} />
            }
        </div>
        <div className={styles.page__left}>
            <div className={styles.left__header}>
                <Header>
                    Traqueurs
                </Header>
            </div>
            <List>
                {
                    data.project.trackers.map((t: any) => {
                        let active = selectedTracker && selectedTracker.id === t.id
                        return <List.Item key={t.id} active={active} className={cn({ [styles.menu_item]: true, [styles.active]: active })} onClick={() => goToSingleTracker(t)}>
                            <List.Content>
                                <List.Header>{t.title}</List.Header>
                                <List.Description>{t.url}</List.Description>
                            </List.Content>
                        </List.Item>
                    })
                }
            </List>
            <Button fluid color="orange">Nouveau traqueur</Button>
        </div>
    </div>

}

export default SingleProject;