function Sidebar({ setPage }) {
    return (
        <aside>
            <div className="hero">
                <h3>CRM</h3>

                <nav>
                    <a href="#" onClick={() => setPage("dashboard")}>
                        Dashboard
                    </a>

                    <a href="#" onClick={() => setPage("pipeline")}>
                        Pipeline
                    </a>

                    <a href="#" onClick={() => setPage("contacts")}>
                        Contacts
                    </a>
                    <a href="#" onClick={() => setPage("activities")}>
                        Activities
                    </a>

                </nav>
            </div>
        </aside>
    );
}

export default Sidebar;