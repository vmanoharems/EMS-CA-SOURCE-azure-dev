SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[spTimeZone]
(
@ProdID int,
@TimeZone varchar(50),
@TimeDifference varchar(50),
@Mode int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  if(@Mode=1)
  begin
   select top(1) TimeZone,TimeDifference from TimeZone order by 1 desc
  end
  else
  begin
   truncate table TimeZone;
   insert into TimeZone values(@ProdID,@TimeZone,@TimeDifference,CURRENT_TIMESTAMP);
    select TimeZone,TimeDifference from TimeZone 
  end


END

GO