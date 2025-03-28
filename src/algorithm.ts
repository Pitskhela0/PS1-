/**
 * Problem Set 1: Flashcards - Algorithm Functions
 *
 * This file contains the implementations for the flashcard algorithm functions
 * as described in the problem set handout.
 *
 * Please DO NOT modify the signatures of the exported functions in this file,
 * or you risk failing the autograder.
 */

import { Flashcard, AnswerDifficulty, BucketMap } from "./flashcards";

/**
 * Converts a Map representation of learning buckets into an Array-of-Set representation.
 *
 * @param buckets Map where keys are bucket numbers and values are sets of Flashcards.
 * @returns Array of Sets, where element at index i is the set of flashcards in bucket i.
 *          Buckets with no cards will have empty sets in the array.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function toBucketSets(buckets: BucketMap): Array<Set<Flashcard>> {
  if (!(buckets instanceof Map)) {
    throw new TypeError("Invalid input: buckets must be a Map.");
  }
  let resultArray: Array<Set<Flashcard>> = new Array();
  for(const [key,value] of buckets.entries()){
    resultArray[key] = value;
  }
  return resultArray;
}

/**
 * Finds the range of buckets that contain flashcards, as a rough measure of progress.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @returns object with minBucket and maxBucket properties representing the range,
 *          or undefined if no buckets contain cards.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function getBucketRange(
  buckets: Array<Set<Flashcard>>
): { minBucket: number; maxBucket: number } | undefined {
  if (!(buckets instanceof Array)) {
    throw new TypeError("Invalid input: buckets must be a Array.");
  }
  if(buckets.length === 0){
    return undefined;
  }

  if(buckets.length == 1){
    for (let index = 0; index < buckets.length; index++) {
      if(buckets[index] !== undefined){
        return {minBucket : index, maxBucket : index};
      }
    }
  }

  let min: number = buckets.length;
  let max: number = 0;
  for (let index = 0; index < buckets.length; index++) {
    const element = buckets[index];
    if(element !== undefined && index < min){
      min = index;
    }
    else if(element !== undefined && index > max){
      max = index;
    }
  }
  return {minBucket : min, maxBucket : max};
}

/**
 * Selects cards to practice on a particular day.
 *
 * @param buckets Array-of-Set representation of buckets.
 * @param day current day number (starting from 0).
 * @returns a Set of Flashcards that should be practiced on day `day`,
 *          according to the Modified-Leitner algorithm.
 * @spec.requires buckets is a valid Array-of-Set representation of flashcard buckets.
 */
export function practice(
  buckets: Array<Set<Flashcard> | undefined>, // Allow undefined elements in array
  day: number
): Set<Flashcard> {
  let result = new Set<Flashcard>();

  if (buckets[0]) {
    for (const card of buckets[0]) {
      result.add(card);
    }
  }

  for (let bucketIndex = 1; bucketIndex < buckets.length; bucketIndex++) {
    const practiceInterval = Math.pow(2, bucketIndex);
    
    const currentBucket = buckets[bucketIndex];
    if (currentBucket && day % practiceInterval === 0) {
      for (const card of currentBucket) {
        result.add(card);
      }
    }
  }

  return result;
}


/**
 * Updates a card's bucket number after a practice trial.
 *
 * @param buckets Map representation of learning buckets.
 * @param card flashcard that was practiced.
 * @param difficulty how well the user did on the card in this practice trial.
 * @returns updated Map of learning buckets.
 * @spec.requires buckets is a valid representation of flashcard buckets.
 */
export function update(
  buckets: BucketMap,
  card: Flashcard,
  difficulty: AnswerDifficulty
): BucketMap {

  if (!(card instanceof Flashcard)) {
    throw new TypeError("Invalid input: card must be a Flashcard.");
  }
  if (!(buckets instanceof Map)) {
    throw new TypeError("Invalid input: buckets must be a Map.");
  }
  // if difficalty was hard put in i-1
  // if difficulty was easy put in i-1
  // if difficulty was wrong put in 0
  

  // first check if flashcard is already in bucketMap
  let keyOfFlashCard:number = -1;
  for(const [key,value] of buckets.entries()){
    if(value.has(card)){
      value.delete(card);
      keyOfFlashCard = key;
      break;
    }
  }

  if(keyOfFlashCard === -1){
    return buckets;
  }

  let newKey:number;
  if(difficulty === AnswerDifficulty.Easy){
    newKey = keyOfFlashCard + 1;
  }
  else if(difficulty === AnswerDifficulty.Hard){
    newKey = keyOfFlashCard - 1 >= 0 ? keyOfFlashCard - 1 : 0;
  }
  else if(difficulty === AnswerDifficulty.Wrong){
    newKey = 0;
  }
  else{
    return buckets;
  }

  if(buckets.has(newKey)){
    buckets.get(newKey)?.add(card);
  }
  else{
    let tempSet:Set<Flashcard> = new Set();
    tempSet.add(card);
    buckets.set(newKey, tempSet);
  }

  return buckets;
}

/**
 * Generates a hint for a flashcard.
 *
 * @param card flashcard to hint
 * @returns a hint for the front of the flashcard.
 * @spec.requires card is a valid Flashcard.
 */
export function getHint(card: Flashcard): string {
  if(card.hint.length > 0){
    return card.hint;
  }
  else{
    return "You do not deserve hint"
  }
}

/**
 * Computes statistics about the user's learning progress.
 *
 * @param buckets representation of learning buckets.
 * @param history representation of user's answer history.
 * @returns statistics about learning progress.
 * @spec.requires [SPEC TO BE DEFINED]
 */
export function computeProgress(buckets: any, history: any): any {
  // Replace 'any' with appropriate types
  // TODO: Implement this function (and define the spec!)
  throw new Error("Implement me!");
}