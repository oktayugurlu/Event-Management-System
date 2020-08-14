package com.etkinlikyonetimi.intern.usecases.manageparticipant.validators;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Documented
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = TcKimlikNoValidator.class)
public @interface TcKimlikNo {

	String message() default "The value is not a valid TC ID no!";

	Class<?>[] groups() default {};

	Class<? extends Payload>[] payload() default {};
}
