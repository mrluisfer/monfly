import {DataNotFoundPlaceholder} from "~/components/shared/DataNotFoundPlaceholder";
import {Skeleton} from "~/components/ui/skeleton";
import {useCards} from "~/hooks/cards";
import {SingleCard} from "@/components/cards/SingleCard";

export function CardsList() {
  const {data, isPending} = useCards();

  const cards = data?.data ?? [];

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-40 rounded-2xl"/>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <DataNotFoundPlaceholder>
        No cards yet. Create one above to start tracking balances per card.
      </DataNotFoundPlaceholder>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => <SingleCard card={card}/>)}
    </div>
  );
}
