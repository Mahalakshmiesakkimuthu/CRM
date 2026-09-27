
import { useState, useEffect } from "react";

function SummaryCards() {
    const [stats, setStats] = useState({
        totalDeals: 0,
        pipelineValue: 0,
        closedWon: 0,
        winRate: 0
    });

    useEffect(() => {
        fetch("http://localhost:5000/dashboard")
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const avgDealSize =
        stats.totalDeals > 0
            ? stats.pipelineValue / stats.totalDeals
            : 0;

    return (
        <section>
            <div className="summary-cards">

                <div className="summary-card">
                    <p>Total Revenue</p>
                    <h3>₹{Number(stats.pipelineValue).toLocaleString()}</h3>
                    <p><span>Live </span>from pipeline</p>
                </div>

                <div className="summary-card">
                    <p>Open Deals</p>
                    <h3>{stats.totalDeals}</h3>
                    <p><span>{stats.closedWon} </span>closed won</p>
                </div>

                <div className="summary-card">
                    <p>Win Rate</p>
                    <h3>{stats.winRate}%</h3>
                    <p><span>Live </span>from pipeline</p>
                </div>

                <div className="summary-card">
                    <p>Avg Deal Size</p>
                    <h3>₹{Math.round(avgDealSize).toLocaleString()}</h3>
                    <p><span>Live </span>from pipeline</p>
                </div>

            </div>
        </section>
    );
}

export default SummaryCards;
