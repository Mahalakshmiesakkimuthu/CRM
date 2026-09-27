import { useState } from "react";

import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Summarycards from "./components/Summarycards.jsx";
import Pipeline from "./components/Pipeline.jsx";
import RecentActivity from "./components/RecentActivity.jsx";
import PipelinePage from "./components/PipelinePage.jsx";
import ContactsPage from "./components/ContactsPage.jsx";
import ActivitiesPage from "./components/ActivitiesPage.jsx";

import "./App.css";


function App() {
    const [page, setPage] = useState("dashboard");

    return (
        <div className="app-layout">
            <Sidebar setPage={setPage} />

            <main>
                {page === "dashboard" && (
                    <>
                        <Header />
                        <Summarycards />

                        <div className="dashboard-bottom">
                            <Pipeline />
                            <RecentActivity />
                        </div>
                    </>
                )}

                {page === "pipeline" && <PipelinePage />}
                {page === "contacts" && <ContactsPage />}
                {page === "activities" && <ActivitiesPage />}

            </main>
        </div>
    );
}

export default App;