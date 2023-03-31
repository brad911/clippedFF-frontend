import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Navbar from "../../components/Navbar";

import Section from "../../components/Section";

const GameRecord = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios
        .get("/games/" + id)
        .then((res) => {
          setData(res.data.game);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Uh Oh! Something went wrong while viewing the game");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  return (
    <Section id="game-record" className="text-center">
      <Navbar />
      {isLoading && <Loader />}
      <div className="card mt-4">
        <h1>Game details</h1>

        <h3 className="my-2">
          Player name: <span className="text-blue">{data?.player?.name}</span>
        </h3>
        <h3>
          Hints used: <span className="text-blue">{data?.hintsUsed}</span>
        </h3>
        {/* <h3>
          Wrong Guesses: <span className="text-blue">{data?.wrongGuesses}</span>
        </h3> */}
        <h3>
          Medal: <span className="text-blue">{data?.medal}</span>
        </h3>
        <h3>
          Played At:{" "}
          <span className="text-blue">
            {new Date(data?.createdAt).toDateString("DD/MM/YYYY")}
          </span>
        </h3>
      </div>

      <h1 className="mt-5">{data?.player?.name}'s Record:</h1>

      <div className="listing">
        <div className="table-container-wrap">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Medal</th>
                  <th>Hints Used</th>
                  {/* <th>Wrong Guesses</th> */}
                  <th>Date </th>
                </tr>
              </thead>
              <tbody>
                {data?.player?.games?.map((el, idx) => {
                  const { _id, medal, hintsUsed, createdAt } = el;

                  return (
                    <tr className="" key={_id}>
                      <td>{medal}</td>
                      <td>{hintsUsed}</td>
                      {/* <td>{wrongGuesses}</td> */}
                      <td>{new Date(createdAt).toDateString("DD/MM/YYYY")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default GameRecord;
