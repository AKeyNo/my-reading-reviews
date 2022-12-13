import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState({} as any);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      const response = await axios.get(`/api/book/${id}`);

      setBook(response.data);
    };

    fetchBook();
  }, [id]);

  if (!book) return <div>loading...</div>;

  return (
    <div>
      {book.title} {book.pageCount}
    </div>
  );
}
