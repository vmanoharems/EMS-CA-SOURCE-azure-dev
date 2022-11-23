SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[CheckClosePeriodStatus]
(
@CompanyID int,
@Period varchar(50)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select * from ClosePeriod where CompanyId=(
select CompanyId from PayrollFile where PayrollFileID=@CompanyID
)

 and PeriodStatus=@Period and Status='Freeze'

END



GO