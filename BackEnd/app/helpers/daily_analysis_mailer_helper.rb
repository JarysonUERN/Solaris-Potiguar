module DailyAnalysisMailerHelper
  def classification_class(analysis)
    case analysis.classification
    when "superavit" then "superavit"
    when "deficit" then "deficit"
    else "equilibrio"
    end
  end

  def classification_label(analysis)
    case analysis.classification
    when "superavit" then "Superávit"
    when "deficit" then "Déficit"
    when "equilibrio" then "Equilíbrio"
    else "N/A"
    end
  end
end
