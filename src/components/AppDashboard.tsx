import { gql, useQuery } from "@apollo/client";
import styles from "../styles/AppDashboard.module.scss";
import { Header, Icon, Container } from "semantic-ui-react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import cn from "classnames";
import ProjectList from "./ProjectList";
import SingleProject from "./SingleProject";
import { useEffect } from "react";

function AppDashboard() {
    const history = useHistory();
    const { data, loading, error } = useQuery(
        gql`
            {
                me {
                    id
                    fullName
                    projects {
                        id
                        title
                        comment
                    }
                }
            }
        `
    )


    useEffect(() => {
        if (error) {
            history.replace("/login");
        }
    }, [error]);

    if (error) {
        return <></>
    }

    if (loading) {
        return <div>...chargement</div>
    }

    return <div className={styles.dashboard}>
        <div className={styles.header}>
            <div className={styles.logoWrapper}>
                <Header className="title" size="large">TrafficHub</Header>
            </div>
            <div className={styles.headerContent}>
                <span className={cn(styles.item, styles.username)}>Bienvenue, <strong>{data.me.fullName}</strong></span>
                <Link className={styles.item} to="/app/">
                    <Icon name="home" />
                </Link>
                <Link className={styles.item} to="/app/notifications">
                    <Icon name="bell" />
                </Link>
                <Link className={styles.item} to="/app/settings">
                    <Icon name="settings" />
                </Link>
            </div>
        </div>
        <div className={styles.content}>
            <Switch>
                <Route path="/app/projects/:id" render={(props) => {
                    return <SingleProject id={props.match.params.id} />
                }} />
                <Route path="/app">
                    <Container>
                        <ProjectList />
                    </Container>
                </Route>
            </Switch>
        </div>
    </div>
}

export default AppDashboard;