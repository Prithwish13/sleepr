import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CardDto {
  /**
   * The card's CVC. It is highly recommended to always include this value.
   */
  @IsString()
  @IsNotEmpty()
  cvc: string;

  /**
   * Two-digit number representing the card's expiration month.
   */
  @IsNumber()
  exp_month?: number;

  /**
   * Four-digit number representing the card's expiration year.
   */
  @IsNumber()
  exp_year?: number;

  /**
   * Contains information about card networks used to process the payment.
   */
  @IsString()
  networks?: 'cartes_bancaires' | 'mastercard' | 'visa';

  /**
   * The card number, as a string without any separators.
   */
  @IsCreditCard()
  number?: string;

  /**
   * For backwards compatibility, you can alternatively provide a Stripe token (e.g., for Apple Pay, Amex Express Checkout, or legacy Checkout) into the card hash with format card: {token: "tok_visa"}.
   */
  @IsString()
  token?: string;
}
