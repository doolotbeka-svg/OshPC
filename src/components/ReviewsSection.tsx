import { Star } from 'lucide-react';
import { REVIEWS } from '../data/serviceData';

export default function ReviewsSection() {
  return (
    <section id="reviews" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-blue-600">Отзывы клиентов из Оша</p>
            <h2 className="font-display mt-2 text-balance text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Реальные истории ремонта на 2ГИС и Google Картах
            </h2>
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <div className="flex items-center gap-0.5 text-amber-500" aria-label="Рейтинг 5.0 из 5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              ))}
            </div>
            <span className="tabular-nums">5.0</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="font-normal text-slate-600">Оценка в 2ГИС и Google</span>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6"
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {review.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {review.district} · {review.device}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-slate-900 tabular-nums">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-700">{review.text}</p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/80 pt-3.5 text-xs text-slate-500">
                <span>Задача: {review.issue}</span>
                <span>
                  {review.source} · {review.date}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
