import { useState, useEffect } from "react";

function ContactsPage() {
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");

    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: ""
    });

    const [contacts, setContacts] = useState([]);

    // GET contacts
    const fetchContacts = () => {
        fetch("https://crm-backend-l81t.onrender.com/contacts")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }

                return response.json();
            })
            .then((data) => {
                setContacts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setFetchError("Unable to load contacts");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.phone ||
            !formData.company
        ) {
            setError("Please fill all fields");
            return;
        }

        if (
            !formData.email.includes("@") ||
            !formData.email.endsWith(".com")
        ) {
            setError("Please enter a valid email");
            return;
        }

        if (formData.phone.length !== 10) {
            setError("Phone number must be 10 digits");
            return;
        }

        if (!/^\d+$/.test(formData.phone)) {
            setError("Phone number must contain only digits");
            return;
        }

        const url =
            editId !== null
                ? `https://crm-backend-l81t.onrender.com/contacts/${editId}`
                : "https://crm-backend-l81t.onrender.com/contacts";

        const method = editId !== null ? "PUT" : "POST";

        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to save contact");
                }

                return response.json();
            })
            .then((data) => {
                console.log(data);

                fetchContacts();

                setShowForm(false);
                setEditId(null);

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: ""
                });

                setError("");
            })
            .catch((error) => {
                console.log(error);
                setError("Unable to save contact");
            });
    };

    const handleDelete = (id) => {
        fetch(
            `https://crm-backend-l81t.onrender.com/contacts/${id}`,
            {
                method: "DELETE"
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to delete contact");
                }

                return response.json();
            })
            .then((data) => {
                console.log(data);
                fetchContacts();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleEdit = (contact) => {
        setEditId(contact.id);

        setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company
        });

        setError("");
        setShowForm(true);
    };

    const filteredContacts = contacts.filter(
        (contact) =>
            contact.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            contact.email
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            contact.phone.includes(search) ||
            contact.company
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <section className="contacts-page">

            <div className="contacts-page-header">
                <div>
                    <h2>Contacts</h2>
                    <p>Manage your customer contacts</p>
                </div>

                <button
                    onClick={() => {
                        setEditId(null);

                        setFormData({
                            name: "",
                            email: "",
                            phone: "",
                            company: ""
                        });

                        setError("");
                        setShowForm(true);
                    }}
                >
                    + Add Contact
                </button>
            </div>

            <div className="contacts-table">

                <h3>All Contacts</h3>

                <input
                    type="text"
                    placeholder="Search contacts..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {loading && (
                            <tr>
                                <td colSpan="5">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {fetchError && (
                            <tr>
                                <td colSpan="5">
                                    {fetchError}
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            !fetchError &&
                            filteredContacts.map((contact) => (
                                <tr key={contact.id}>

                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.company}</td>

                                    <td>
                                        <button
                                            onClick={() =>
                                                handleEdit(contact)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                handleDelete(contact.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </td>

                                </tr>
                            ))}

                    </tbody>
                </table>

                {showForm && (
                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                    >

                        {error && (
                            <p className="form-error">
                                {error}
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => {
                                setError("");

                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                });
                            }}
                        />

                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => {
                                setError("");

                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                });
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={(e) => {
                                setError("");

                                setFormData({
                                    ...formData,
                                    phone: e.target.value
                                });
                            }}
                        />

                        <input
                            type="text"
                            placeholder="Company"
                            value={formData.company}
                            onChange={(e) => {
                                setError("");

                                setFormData({
                                    ...formData,
                                    company: e.target.value
                                });
                            }}
                        />

                        <button type="submit">
                            {editId !== null
                                ? "Update Contact"
                                : "Save Contact"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditId(null);
                                setError("");
                            }}
                        >
                            Cancel
                        </button>

                    </form>
                )}

            </div>

        </section>
    );
}

export default ContactsPage;