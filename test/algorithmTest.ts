import assert from "assert";
import { AnswerDifficulty, Flashcard, BucketMap } from "../src/flashcards";
import {
  toBucketSets,
  getBucketRange,
  practice,
  update,
  getHint,
  computeProgress,
} from "../src/algorithm";

/*
 * Testing strategy for toBucketSets():
 *
 * Tests will cover: 
 *    *should work well tests*:
 *      1. Empty BucketMap
 *      2. Non-empty BucketMap with empty Set<Flashcard>
 *      3. Non-empty BucketMap with non-empty Set<Flashcard>
 *      4. BucketMap with gap within keys
 * 
 *    *should not work well test*:
 *      1. Invalid input, for example, buckets = null
 */
describe("toBucketSets()", () => {
  it("Empty BucketMaps", () => {
    let emptyBucketMap: BucketMap = new Map();
    assert.equal(toBucketSets(emptyBucketMap).length,0);
  });
  it("Non-empty BucketMap with empty Set<Flashcard>", () => {
    let bucketMap: BucketMap = new Map();

    let set1: Set<Flashcard> = new Set();
    let set2: Set<Flashcard> = new Set();
    
    bucketMap.set(0,set1);
    bucketMap.set(1,set2);

    let res: Array<Set<Flashcard>> = new Array();
    res.push(set1);
    res.push(set2);

    let actual: Array<Set<Flashcard>> = toBucketSets(bucketMap);

    assert.equal(actual.length, res.length);

    for (let index = 0; index < res.length; index++) {
      assert.deepEqual(actual[index],res[index]);
    }
  });

  it("Non-empty BucketMap with non-empty Set<Flashcard>", () =>{
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));

    let set2: Set<Flashcard> = new Set();
    set1.add(new Flashcard("d","e","f",new Array()));

    bucketMap.set(0,set1);
    bucketMap.set(1,set2);
    let res: Array<Set<Flashcard>> = new Array();
    res.push(set1);
    res.push(set2);

    let actual: Array<Set<Flashcard>> = toBucketSets(bucketMap);

    assert.equal(actual.length, res.length);

    for (let index = 0; index < res.length; index++) {
      assert.deepEqual(actual[index],res[index]);
    }
  });

  it("BucketMap with gap within keys", () => {
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));

    let set2: Set<Flashcard> = new Set();
    set2.add(new Flashcard("d","e","f",new Array()));

    bucketMap.set(0,set1);
    bucketMap.set(7,set2);
    
    let res: Array<Set<Flashcard>> = new Array();
    res[0] = set1;
    res[7] = set2;

    let actual: Array<Set<Flashcard>> = toBucketSets(bucketMap);

    assert.equal(actual.length, res.length);

    assert.equal(actual[0], res[0]);
    assert.equal(actual[7],res[7]);
  });

  it("should throw an error when buckets is null", () => {
    assert.throws(() => {
      toBucketSets(null as any);
    }, TypeError);
  });
});

/*
 * Testing strategy for getBucketRange():
 *
 *    *should work well tests*: 
 *    1. Empty array
 *    2. Non-empty array
 *    3. Array with one element
 * 
 * 
 *    *should not work well tests*: 
 *     1. Invalid input
 */
describe("getBucketRange()", () => {
  it("Empty array", () => {
    let emptyArray: Array<Set<Flashcard>> = new Array();
    assert.equal(getBucketRange(emptyArray), undefined);
  });

  it("Non-empty array", () => {
      let array: Array<Set<Flashcard>> = new Array();
      let set1: Set<Flashcard> = new Set();
      set1.add(new Flashcard("a","b","c",new Array()));

      let set2: Set<Flashcard> = new Set();
      set2.add(new Flashcard("d","e","f",new Array()));

      array[0] = set1;
      array[9] = set2;
      assert.deepEqual(
        getBucketRange(array), {minBucket : 0, maxBucket : 9}
      );
  });

  it("1 element array", () => {
    let array: Array<Set<Flashcard>> = new Array();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));

    array[0] = set1;
    
    assert.deepEqual(
      getBucketRange(array), {minBucket : 0, maxBucket : 0}
    );
  });

  it("should throw an error when buckets is null", () => {
    assert.throws(() => {
      getBucketRange(null as any);
    }, TypeError);
  });
});


// Test suite for practice function
describe("practice()", () => {

  // Helper function to create flashcards easily for tests
  const createFlashcard = (front: string, back: string, hint?: string) => new Flashcard(front, back, hint as any,new Array());

  it("should practice cards from bucket 0 every day", () => {
    const bucket0 = new Set<Flashcard>([createFlashcard("Front0", "Back0")]);
    const bucket1 = new Set<Flashcard>();
    const bucket2 = new Set<Flashcard>();
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (should practice bucket 0 cards)
    let result = practice(buckets, 0);
    assert.equal(result.size, 1, "One card should be practiced from bucket 0 on day 0");

    // Day 1 (should practice bucket 0 cards)
    result = practice(buckets, 1);
    assert.equal(result.size, 1, "One card should be practiced from bucket 0 on day 1");
  });

  it("should practice cards from bucket 1 every 2 days", () => {
    const bucket0 = new Set<Flashcard>([createFlashcard("Front0", "Back0")]);
    const bucket1 = new Set<Flashcard>([createFlashcard("Front1", "Back1")]);
    const bucket2 = new Set<Flashcard>();
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (only bucket 0 is practiced)
    let result = practice(buckets, 0);
    assert.equal(result.size, 1, "One card should be practiced from bucket 0 on day 0");

    // Day 2 (bucket 1 should be practiced)
    result = practice(buckets, 2);
    assert.equal(result.size, 2, "Cards from bucket 0 and bucket 1 should be practiced on day 2");
  });

  it("should practice cards from bucket 2 every 4 days", () => {
    const bucket0 = new Set<Flashcard>([createFlashcard("Front0", "Back0")]);
    const bucket1 = new Set<Flashcard>([createFlashcard("Front1", "Back1")]);
    const bucket2 = new Set<Flashcard>([createFlashcard("Front2", "Back2")]);
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (only bucket 0 is practiced)
    let result = practice(buckets, 0);
    assert.equal(result.size, 1, "One card should be practiced from bucket 0 on day 0");

    // Day 4 (bucket 2 should be practiced)
    result = practice(buckets, 4);
    assert.equal(result.size, 3, "Cards from bucket 0, bucket 1, and bucket 2 should be practiced on day 4");
  });

  it("should return an empty set if no buckets contain cards to practice", () => {
    const bucket0 = new Set<Flashcard>();
    const bucket1 = new Set<Flashcard>();
    const bucket2 = new Set<Flashcard>();
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (no cards to practice)
    let result = practice(buckets, 0);
    assert.equal(result.size, 0, "No cards should be practiced when all buckets are empty");

    // Day 1 (still no cards to practice)
    result = practice(buckets, 1);
    assert.equal(result.size, 0, "No cards should be practiced when all buckets are empty");
  });

  it("should handle undefined buckets gracefully", () => {
    const bucket0 = new Set<Flashcard>([createFlashcard("Front0", "Back0")]);
    const bucket1 = undefined;
    const bucket2 = new Set<Flashcard>([createFlashcard("Front2", "Back2")]);
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (only bucket 0 is practiced)
    let result = practice(buckets, 0);
    assert.equal(result.size, 1, "One card should be practiced from bucket 0 on day 0");

    // Day 2 (bucket 2 should be practiced)
    result = practice(buckets, 2);
    assert.equal(result.size, 2, "Cards from bucket 0 and bucket 2 should be practiced on day 2");
  });

  it("should return cards based on correct intervals for multiple buckets", () => {
    const bucket0 = new Set<Flashcard>([createFlashcard("Front0", "Back0")]);
    const bucket1 = new Set<Flashcard>([createFlashcard("Front1", "Back1")]);
    const bucket2 = new Set<Flashcard>([createFlashcard("Front2", "Back2")]);
    const buckets = [bucket0, bucket1, bucket2];

    // Day 0 (should practice bucket 0)
    let result = practice(buckets, 0);
    assert.equal(result.size, 1, "One card from bucket 0 should be practiced on day 0");

    // Day 1 (should practice bucket 0 only)
    result = practice(buckets, 1);
    assert.equal(result.size, 1, "One card from bucket 0 should be practiced on day 1");

    // Day 2 (should practice bucket 0 and bucket 1)
    result = practice(buckets, 2);
    assert.equal(result.size, 2, "Cards from bucket 0 and bucket 1 should be practiced on day 2");

    // Day 4 (should practice bucket 0, bucket 1, and bucket 2)
    result = practice(buckets, 4);
    assert.equal(result.size, 3, "Cards from bucket 0, bucket 1, and bucket 2 should be practiced on day 4");
  });
});


/*
 * Testing strategy for update():
 *    *should work well tests*: 
 *    1. newKey does not exist in buckets
 *    2. newKey exists in buckets
 *    3. newKey is less then 0
 *    4. Flashcard does not exists in buckets
 *    
 * 
 *    *should not work well tests*: 
 *    1. invalid buckets
 *    2. invalid flashcard
 * 
 */
describe("update()", () => {
  it("newKey does not exist in buckets", () => {
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));

    let set2: Set<Flashcard> = new Set();
    let f1: Flashcard = new Flashcard("d","e","f",new Array());
    set2.add(f1);

    bucketMap.set(0,set1);
    bucketMap.set(7,set2);

    let actual: BucketMap = new Map();
    actual.set(0, set1);
    actual.set(7, new Set());
    let set3: Set<Flashcard> = new Set();
    set3.add(new Flashcard("d","e","f",new Array()));
    actual.set(8, set3);



    let diff: AnswerDifficulty = AnswerDifficulty.Easy;

    assert.deepEqual(update(bucketMap,f1,diff),actual);
    
  });

  it("newKey exists in buckets", () => {
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));
    let f1: Flashcard = new Flashcard("a1","b1","c1",new Array());
    set1.add(f1);

    let set2: Set<Flashcard> = new Set();
    set2.add(new Flashcard("a2","b2","c2",new Array()));

    bucketMap.set(0,set1);
    bucketMap.set(1,set2);

    let actual: BucketMap = new Map();
    
    let set3: Set<Flashcard> = new Set();
    set3.add(new Flashcard("a","b","c",new Array()));
    

    let set4: Set<Flashcard> = new Set();
    set4.add(new Flashcard("a1","b1","c1",new Array()));
    set4.add(new Flashcard("a2","b2","c2",new Array()));

    actual.set(0,set3);
    actual.set(1,set4);
    

    let diff: AnswerDifficulty = AnswerDifficulty.Easy;

    assert.deepEqual(update(bucketMap,f1,diff),actual);
  });

  it("newKey is less then 0", () => {
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));
    let f1: Flashcard = new Flashcard("a1","b1","c1",new Array());
    set1.add(f1);

    let set2: Set<Flashcard> = new Set();
    set2.add(new Flashcard("a2","b2","c2",new Array()));

    bucketMap.set(0,set1);
    bucketMap.set(1,set2);

    let diff: AnswerDifficulty = AnswerDifficulty.Easy;


    assert.deepEqual(update(bucketMap,f1,diff),bucketMap);

  });

  it("Flashcard does not exists in buckets", () => {
    let bucketMap: BucketMap = new Map();
    let set1: Set<Flashcard> = new Set();
    set1.add(new Flashcard("a","b","c",new Array()));
    let f1: Flashcard = new Flashcard("a1","b1","c1",new Array());
    set1.add(f1);

    let set2: Set<Flashcard> = new Set();
    set2.add(new Flashcard("a2","b2","c2",new Array()));

    bucketMap.set(0,set1);
    bucketMap.set(1,set2);


    let diff: AnswerDifficulty = AnswerDifficulty.Easy;
    
    assert.deepEqual(update(bucketMap,new Flashcard("j","i","l",new Array()),diff),bucketMap);

  });

  it("invalid buckets", () => {
      assert.throws(() => {
        update(null as any, new Flashcard("a","b","c",new Array()),AnswerDifficulty.Easy);
      }, TypeError);
  });

  it("invalid flashcard", () => {
    assert.throws(() => {
      update(null as any, null as any, AnswerDifficulty.Easy);
    }, TypeError);
  });
});

describe("getHint()", () => {
  
  it("should return the hint when it exists", () => {
    const cardWithHint = new Flashcard("Front", "Back", "This is a hint", []);
    const result = getHint(cardWithHint);
    assert.equal(result, "This is a hint", "The hint should be returned correctly.");
  });

  it("should return 'You do not deserve hint' when no hint is provided", () => {
    const cardWithoutHint = new Flashcard("Front", "Back", "", []);
    const result = getHint(cardWithoutHint);
    assert.equal(result, "You do not deserve hint", "The correct message is returned when no hint is present.");
  });

  it("should return a hint even when the hint is a single character", () => {
    const cardWithSingleCharHint = new Flashcard("Front", "Back", "H", []);
    const result = getHint(cardWithSingleCharHint);
    assert.equal(result, "H", "The function should return even a single character hint.");
  });

  it("should return 'You do not deserve hint' if the hint is an empty string", () => {
    const cardWithEmptyHint = new Flashcard("Front", "Back", "", []);
    const result = getHint(cardWithEmptyHint);
    assert.equal(result, "You do not deserve hint", "Empty string should be considered as no hint.");
  });

  it("should handle cases where the hint is undefined", () => {
    const cardWithUndefinedHint = new Flashcard("Front", "Back", undefined as any, []);
    const result = getHint(cardWithUndefinedHint);
    assert.equal(result, "You do not deserve hint", "If the hint is undefined, the function should return the default message.");
  });
  
});

/*
 * Testing strategy for computeProgress():
 *
 * TODO: Describe your testing strategy for computeProgress() here.
 */
describe("computeProgress()", () => {
  it("Example test case - replace with your own tests", () => {
    assert.fail(
      "Replace this test case with your own tests based on your testing strategy"
    );
  });
});
