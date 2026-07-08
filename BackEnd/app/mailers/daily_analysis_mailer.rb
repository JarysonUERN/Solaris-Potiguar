class DailyAnalysisMailer < ApplicationMailer
  def report_email(user, analyses)
    @user = user
    @analyses = analyses
    @date = I18n.l(Time.current, format: :long)
    mail(to: user.email, subject: "☀️ Relatório Diário Solaris Potiguar - #{Time.current.strftime('%d/%m/%Y')}")
  end
end
