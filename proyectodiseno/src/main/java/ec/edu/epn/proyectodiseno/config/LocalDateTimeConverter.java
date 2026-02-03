package ec.edu.epn.proyectodiseno.config;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Converter(autoApply = true)
public class LocalDateTimeConverter implements AttributeConverter<LocalDateTime, String> {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    @Override
    public String convertToDatabaseColumn(LocalDateTime locDateTime) {
        return (locDateTime == null ? null : locDateTime.format(FORMATTER));
    }

    @Override
    public LocalDateTime convertToEntityAttribute(String sqlTimestamp) {
        return (sqlTimestamp == null || sqlTimestamp.isEmpty() ? null : LocalDateTime.parse(sqlTimestamp, FORMATTER));
    }
}
