type Props = {
  search: string;
  setSearch: (
    value: string
  ) => void;
};

export default function SearchBar({
  search,
  setSearch,
}: Props) {

  return (

    <input

      className="w-full bg-zinc-900 rounded-2xl p-5 outline-none border border-zinc-800 mb-8"

      placeholder="Search memo or address..."

      value={
        search
      }

      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }

    />

  );

}