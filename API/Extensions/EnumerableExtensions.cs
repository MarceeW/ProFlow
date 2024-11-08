using System;

namespace API.Extensions;

public static class EnumerableExtensions
{
    public static IEnumerable<T> SelectFirstAndLast<T>(this IEnumerable<T> source)
    {
        using var enumerator = source.GetEnumerator();
        if (!enumerator.MoveNext())
        {
            throw new InvalidOperationException("The collection is empty.");
        }

        T first = enumerator.Current;
        T last = first;

        while (enumerator.MoveNext())
        {
            last = enumerator.Current;
        }

        return [first, last];
    }   
}
