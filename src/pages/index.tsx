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
                <Button
                  className="bg-lime-600 hover:bg-lime-800 text-right w-8 h-8 border border-gray-100 rounded-md transition-filter duration-200 hover:brightness-90 relative"
                  type="button"
                  onClick={() => playList(episodeList, index)}
                >
                  <Play size={22} className="absolute inset-0 m-auto" />
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
      <hr className={styles.hr} />
      <section className={styles.allEpisodes}>
        <h2>Todos os Episódios</h2>

        <Table className="w-full table-fixed h-[400px] overflow-hidden pb-8">
          <TableHeader className="sticky top-0 bg-white">
            <TableRow>
              <TableHead className="w-1/12 text-left"></TableHead>
              <TableHead className="w-1/3 text-start uppercase text-gray-400 font-medium text-xs">
                Podcast
              </TableHead>
              <TableHead className="w-1/3 text-start px-0 mx-0 uppercase text-gray-400 font-medium text-xs">
                Integrantes
              </TableHead>
              <TableHead className="w-[11%] text-start uppercase text-gray-400 font-medium text-xs">
                Data
              </TableHead>
              <TableHead className="w-1/4 text-start uppercase text-gray-400 font-medium text-xs">
                Duração
              </TableHead>
              <TableHead className="w-1/12 text-left"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="max-h-[40vh] overflow-y-scroll block">
            {allEpisodes.map((episode, index) => {
              helpers.handleData(episode.publishedAt);

              return (
                <TableRow key={episode.id} className="table">
                  <TableCell className="w-1/12 p-3 border-b border-gray-100">
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.description}
                      className="object-cover w-10 h-10 rounded-md"
                    />
                  </TableCell>
                  <TableCell className="w-1/3">
                    <Link href={`episodes/${episode.id}`}>
                      <>{episode.title}</>
                    </Link>
                  </TableCell>
                  <TableCell className="w-1/3 p-3 border-b border-gray-100">
                    {episode.members}
                  </TableCell>
                  <TableCell className="w-1/12 p-3 border-b border-gray-100 text-center">
                    {helpers.handleData(episode.publishedAt)}
                  </TableCell>
                  <TableCell className="w-1/4 p-3 border-b border-gray-100 text-center">
                    {episode.durationAsString}
                  </TableCell>
                  <TableCell className="w-1/4 p-3 border-b border-gray-100">
                    <Button
                      className="bg-violet-500 text-right w-8 h-8 border border-gray-100 rounded-md transition-filter duration-200 hover:brightness-90 relative"
                      type="button"
                      onClick={() =>
                        playList(episodeList, index + lastestEpisodes.length)
                      }
                    >
                      <Play size={20} className="absolute inset-0 m-auto" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
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
