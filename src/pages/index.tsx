// import { useEffect } from "react"
import { GetStaticProps } from "next";
import Image from "next/image";
import { api } from "../services/api";
import { format, parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { conversor } from "../utils/conversor";
import styles from "./home.module.scss";
import Link from "next/link";
import { usePlayer } from "../contexts/PlayerContext";
import Head from "next/head";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import helpers from "../utils/helpers";

type Episodes = {
  id: string;
  title: string;
  nember: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
};

type HomeProps = {
  lastestEpisodes: Episodes[];
  allEpisodes: Episodes[];
};

export default function Home({ lastestEpisodes, allEpisodes }: HomeProps) {
  // const play = useContext(PlayerContext);
  const { playList } = usePlayer();

  const episodeList = [...lastestEpisodes, ...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.lastestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {lastestEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.description}
                  objectFit="cover"
                />
                <div className={styles.episodesDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <>{episode.title}</>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>
                <button
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <img src="/play-green.svg" alt="Tocar Episódio" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <hr className={styles.hr} />
      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>
        <div className="w-full h-full">
          <Table className="w-full h-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12 text-left"></TableHead>
                <TableHead className="w-1/3 text-start">Podcast</TableHead>
                <TableHead className="w-1/3 text-start px-0 mx-0">
                  Integrantes
                </TableHead>
                <TableHead className="w-[11%] text-start">Data</TableHead>
                <TableHead className="w-1/4 text-start">Duração</TableHead>
                <TableHead className="w-1/12 text-left"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allEpisodes.map((episode, index) => {
                helpers.handleData(episode.publishedAt);

                return (
                  <TableRow key={episode.id}>
                    <TableCell className="w-1/12">
                      <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.description}
                        objectFit={"cover"}
                      />
                    </TableCell>
                    <TableCell className="w-1/3">
                      <Link href={`episodes/${episode.id}`}>
                        <>{episode.title}</>
                      </Link>
                    </TableCell>
                    <TableCell className="w-1/3">{episode.members}</TableCell>
                    <TableCell className="w-1/12 text-center">
                      {helpers.handleData(episode.publishedAt)}
                    </TableCell>
                    <TableCell className="w-1/4 text-center">
                      {episode.durationAsString}
                    </TableCell>
                    <TableCell className="w-1/4">
                      <Button
                        className="bg-violet-500 text-right "
                        type="button"
                        onClick={() =>
                          playList(episodeList, index + lastestEpisodes.length)
                        }
                      >
                        <Play size={20} className="absolute mx-auto" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("episodes", {
    params: {
      _limit: 30,
      _sort: "published_at",
      _order: "desc",
    },
  });

  const episodes = data.map((episode) => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
        locale: ptBR,
      }),
      duration: Number(episode.file.duration),
      durationAsString: conversor(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  });

  const lastestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      lastestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  };
};
